import { CryptoService } from "src/common/services/crypto.service";
import { InvalidSessionException, InvalidSessionReason } from "../exceptions/invalidSession.exception";
import { UsersService } from "src/modules/users/services/users.service";
import { SessionRepository } from "../repositories/session.repository";
import { JWTService } from "src/modules/sessions/services/jwt.service";
import { SessionRevokeType } from "../session.entity";
import { UserEntity } from "src/modules/users/user.entity";
import { SESSION_CONSTANT } from "../session.constant";
import { Injectable, Logger } from "@nestjs/common";

interface InterfaceCreateProps {
  ipAddress?: string;
  userAgent?: string;
  userId: string;
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly sessionRepository: SessionRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JWTService,
  ) {}

  public async create(props: InterfaceCreateProps): Promise<{ refresh: string; access: string }> {
    const { userId, ipAddress, userAgent } = props;

    this.logger.debug("Creating session.", { userId });

    const session = this.sessionRepository.create({
      expiresAt: new Date(Date.now() + SESSION_CONSTANT.SESSION_EXPIRES_IN_MS),
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
      id: this.cryptoService.randomUUID(),
      userId: userId,
      revoked: false,
    });

    const refresh = this.jwtService.createRefreshToken({
      sessionId: session.id,
      userId: userId,
    });

    session.refreshTokenHash = this.cryptoService.hash(refresh);

    await this.sessionRepository.save(session);

    const access = this.jwtService.createAccessToken({
      sessionId: session.id,
      userId: userId,
    });

    this.logger.debug("Session created.", { sessionId: session.id, userId });

    return { refresh, access };
  }

  public async refresh(refresh: string): Promise<{ refresh: string; access: string }> {
    const { sessionId, userId } = this.jwtService.verifyRefreshToken(refresh);

    const session = await this.sessionRepository.findById(sessionId);

    if (session === null) {
      this.logger.debug("Refresh attempted for unknown session.", { sessionId });

      throw new InvalidSessionException(InvalidSessionReason.NOT_FOUND, true);
    }

    if (session.revoked) {
      this.logger.warn("Refresh attempted for revoked session.", { sessionId: session.id, userId: session.userId });

      throw new InvalidSessionException(InvalidSessionReason.REVOKED, true);
    }

    if (session.expiresAt.getTime() < Date.now()) {
      this.logger.debug("Refresh attempted for expired session.", { sessionId: session.id });

      if (session.revokeType !== SessionRevokeType.EXPIRED) {
        session.revokeType = SessionRevokeType.EXPIRED;
        await this.sessionRepository.save(session);
      }

      throw new InvalidSessionException(InvalidSessionReason.EXPIRED, true);
    }

    const hash = this.cryptoService.hash(refresh);

    if (this.cryptoService.timingSafeEqual(hash, session.refreshTokenHash) === false) {
      this.logger.warn("Refresh token reuse detected. Session revoked.", {
        sessionId: session.id,
        userId: session.userId,
      });

      await this.sessionRepository.revokeById(session.id, SessionRevokeType.TOKEN_REUSE);

      throw new InvalidSessionException(InvalidSessionReason.TOKEN_REUSE, true);
    }

    const newRefresh = this.jwtService.createRefreshToken({
      sessionId: session.id,
      userId: session.userId,
    });

    session.refreshTokenHash = this.cryptoService.hash(newRefresh);

    await this.sessionRepository.save(session);

    const access = this.jwtService.createAccessToken({
      sessionId: session.id,
      userId: userId,
    });

    this.logger.debug("Session refreshed.", { sessionId: session.id });

    return { refresh: newRefresh, access };
  }

  public async verifyAccessToken(access: string): Promise<{ sessionId: string; user: UserEntity }> {
    const { sessionId, userId } = this.jwtService.verifyAccessToken(access);

    const user = await this.usersService.findById(userId);

    if (user === null) {
      this.logger.warn("Access token valid but user not found.", { sessionId, userId });

      throw new InvalidSessionException(InvalidSessionReason.USER_NOT_FOUND, true);
    }

    return {
      sessionId: sessionId,
      user: user,
    };
  }

  public async revoke(sessionId: string): Promise<void> {
    await this.sessionRepository.revokeById(sessionId, SessionRevokeType.LOGOUT);

    this.logger.log("Session revoked.", { sessionId, reason: SessionRevokeType.LOGOUT });
  }

  public async revokeAll(userId: string): Promise<void> {
    await this.sessionRepository.revokeAllByUserID(userId, SessionRevokeType.LOGOUT_ALL);

    this.logger.log("All sessions revoked.", { userId, reason: SessionRevokeType.LOGOUT_ALL });
  }
}
