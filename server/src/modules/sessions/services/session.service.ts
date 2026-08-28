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
  userID: string;
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
    const { userID, ipAddress, userAgent } = props;

    this.logger.debug("Creating session.", { userID });

    const session = this.sessionRepository.create({
      expiresAt: new Date(Date.now() + SESSION_CONSTANT.SESSION_EXPIRES_IN_MS),
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
      ID: this.cryptoService.randomUUID(),
      userID: userID,
      revoked: false,
    });

    const refresh = this.jwtService.createRefreshToken({
      sessionID: session.ID,
      userID: userID,
    });

    session.refreshTokenHash = this.cryptoService.hash(refresh);

    await this.sessionRepository.save(session);

    const access = this.jwtService.createAccessToken({
      sessionID: session.ID,
      userID: userID,
    });

    this.logger.debug("Session created.", { sessionID: session.ID, userID });

    return { refresh, access };
  }

  public async refresh(refresh: string): Promise<{ refresh: string; access: string }> {
    const { sessionID, userID } = this.jwtService.verifyRefreshToken(refresh);

    const session = await this.sessionRepository.findByID(sessionID);

    if (session === null) {
      this.logger.debug("Refresh attempted for unknown session.", { sessionID });

      throw new InvalidSessionException(InvalidSessionReason.NOT_FOUND, true);
    }

    if (session.revoked) {
      this.logger.warn("Refresh attempted for revoked session.", { sessionID: session.ID, userID: session.userID });

      throw new InvalidSessionException(InvalidSessionReason.REVOKED, true);
    }

    if (session.expiresAt.getTime() < Date.now()) {
      this.logger.debug("Refresh attempted for expired session.", { sessionID: session.ID });

      throw new InvalidSessionException(InvalidSessionReason.EXPIRED, true);
    }

    const hash = this.cryptoService.hash(refresh);

    if (this.cryptoService.timingSafeEqual(hash, session.refreshTokenHash) === false) {
      this.logger.warn("Refresh token reuse detected. Session revoked.", {
        sessionID: session.ID,
        userID: session.userID,
      });

      await this.sessionRepository.revokeByID(session.ID, SessionRevokeType.TOKEN_REUSE);

      throw new InvalidSessionException(InvalidSessionReason.TOKEN_REUSE, true);
    }

    const newRefresh = this.jwtService.createRefreshToken({
      sessionID: session.ID,
      userID: session.userID,
    });

    session.refreshTokenHash = this.cryptoService.hash(newRefresh);

    await this.sessionRepository.save(session);

    const access = this.jwtService.createAccessToken({
      sessionID: session.ID,
      userID: userID,
    });

    this.logger.debug("Session refreshed.", { sessionID: session.ID });

    return { refresh: newRefresh, access };
  }

  public async verifyAccessToken(access: string): Promise<{ sessionID: string; user: UserEntity }> {
    const { sessionID, userID } = this.jwtService.verifyAccessToken(access);

    const user = await this.usersService.findByID(userID);

    if (user === null) {
      this.logger.warn("Access token valid but user not found.", { sessionID, userID });

      throw new InvalidSessionException(InvalidSessionReason.USER_NOT_FOUND, true);
    }

    return {
      sessionID: sessionID,
      user: user,
    };
  }

  public async revoke(sessionID: string): Promise<void> {
    await this.sessionRepository.revokeByID(sessionID, SessionRevokeType.LOGOUT);

    this.logger.log("Session revoked.", { sessionID, reason: SessionRevokeType.LOGOUT });
  }

  public async revokeAll(userID: string): Promise<void> {
    await this.sessionRepository.revokeAllByUserID(userID, SessionRevokeType.LOGOUT_ALL);

    this.logger.log("All sessions revoked.", { userID, reason: SessionRevokeType.LOGOUT_ALL });
  }
}
