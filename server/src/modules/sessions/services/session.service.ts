import { CryptoService } from "src/common/services/crypto.service";
import { InvalidSessionException, InvalidSessionReason } from "../exceptions/invalidSession.exception";
import { SessionRepository } from "../repositories/session.repository";
import { JWTService } from "src/modules/sessions/services/jwt.service";
import { SessionEntity, SessionRevokeType } from "../session.entity";
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
    private readonly jwtService: JWTService,
  ) {}

  public async create(props: InterfaceCreateProps): Promise<{ refresh: string; access: string }> {
    const { userId, ipAddress, userAgent } = props;

    this.logger.debug("Creating session.", { userId });

    const session = this.sessionRepository.create({
      expiresAt: new Date(Date.now() + SESSION_CONSTANT.SESSION_EXPIRES_IN_MS),
      userAgent: userAgent?.substring(0, 254) ?? null,
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

    const newHash = this.cryptoService.hash(newRefresh);

    const rotation = await this.sessionRepository.rotateRefreshToken(session.id, hash, newHash);

    if ((rotation.affected ?? 0) === 0) {
      this.logger.warn("Concurrent refresh detected. Session revoked.", {
        sessionId: session.id,
        userId: session.userId,
      });

      await this.sessionRepository.revokeById(session.id, SessionRevokeType.TOKEN_REUSE);

      throw new InvalidSessionException(InvalidSessionReason.TOKEN_REUSE, true);
    }

    session.refreshTokenHash = newHash;

    const access = this.jwtService.createAccessToken({
      sessionId: session.id,
      userId: userId,
    });

    this.logger.debug("Session refreshed.", { sessionId: session.id });

    return { refresh: newRefresh, access };
  }

  public async verifyAccessToken(access: string): Promise<{ sessionId: string; user: UserEntity }> {
    const { sessionId, userId } = this.jwtService.verifyAccessToken(access);

    const session = await this.sessionRepository.findByIdAndUserIdWithUser(sessionId, userId);

    if (session === null) {
      this.logger.warn("Access token valid but session not found.", { sessionId, userId });

      throw new InvalidSessionException(InvalidSessionReason.NOT_FOUND, true);
    }

    if (session.revoked) {
      this.logger.warn("Access token valid but session revoked.", { sessionId, userId });

      throw new InvalidSessionException(InvalidSessionReason.REVOKED, true);
    }

    if (session.expiresAt.getTime() < Date.now()) {
      this.logger.debug("Access token valid but session expired.", { sessionId, userId });

      throw new InvalidSessionException(InvalidSessionReason.EXPIRED, true);
    }

    return {
      sessionId: session.id,
      user: session.user,
    };
  }

  public async revoke(sessionId: string, reason: SessionRevokeType): Promise<void> {
    await this.sessionRepository.revokeById(sessionId, reason);

    this.logger.log("Session revoked.", { sessionId, reason });
  }

  public async revokeAll(userId: string, reason: SessionRevokeType): Promise<void> {
    await this.sessionRepository.revokeAllByUserID(userId, reason);

    this.logger.log("All sessions revoked.", { userId, reason });
  }

  public findAll(limit: number, offset: number, userId?: string): Promise<[SessionEntity[], number]> {
    return this.sessionRepository.findAll(limit, offset, userId);
  }

  public async deleteExpiredSessions(): Promise<number> {
    const { affected } = await this.sessionRepository.deleteExpiredBefore(new Date());

    return affected ?? 0;
  }

  public async deleteOldRevokedSessions(): Promise<number> {
    const threshold = new Date(Date.now() - SESSION_CONSTANT.REVOKED_SESSION_RETENTION_MS);

    const { affected } = await this.sessionRepository.deleteRevokedBefore(threshold);

    return affected ?? 0;
  }
}
