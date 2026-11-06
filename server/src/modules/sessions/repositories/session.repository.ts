import { Repository, DeleteResult, EntityManager, LessThan, UpdateResult } from "typeorm";
import { SessionEntity, SessionRevokeType } from "../session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  public findById(id: string): Promise<SessionEntity | null> {
    return this.sessionRepository.findOne({ where: { id: id } });
  }

  public findByIdAndUserIdWithUser(id: string, userId: string): Promise<SessionEntity | null> {
    return this.sessionRepository.findOne({
      where: { id: id, userId: userId },
      relations: { user: true },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        revoked: true,
        user: {
          id: true,
          username: true,
          email: true,
          emailVerified: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });
  }

  public findAll(limit: number, offset: number, userId?: string): Promise<[SessionEntity[], number]> {
    return this.sessionRepository.findAndCount({
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        revoked: true,
        revokedAt: true,
        revokeType: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          username: true,
          email: true,
        },
      },
      relations: { user: true },
      where: userId === undefined ? {} : { userId: userId },
      order: { createdAt: "DESC", id: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  public create(props: Partial<SessionEntity>): SessionEntity {
    return this.sessionRepository.create(props);
  }

  public save(session: SessionEntity): Promise<SessionEntity> {
    return this.sessionRepository.save(session);
  }

  public revokeById(id: string, revokeType: SessionRevokeType): Promise<UpdateResult> {
    return this.sessionRepository.update(
      { id: id, revoked: false },
      { revoked: true, revokeType: revokeType, revokedAt: new Date() },
    );
  }

  public revokeAllByUserID(userId: string, revokeType: SessionRevokeType): Promise<UpdateResult> {
    return this.sessionRepository.update(
      { userId: userId, revoked: false },
      { revoked: true, revokeType: revokeType, revokedAt: new Date() },
    );
  }

  public deleteExpiredBefore(date: Date): Promise<DeleteResult> {
    return this.sessionRepository.delete({ expiresAt: LessThan(date) });
  }

  public deleteRevokedBefore(date: Date): Promise<DeleteResult> {
    return this.sessionRepository.delete({ revoked: true, revokedAt: LessThan(date) });
  }

  public rotateRefreshToken(id: string, oldHash: string, newHash: string): Promise<UpdateResult> {
    return this.sessionRepository.update(
      { id: id, refreshTokenHash: oldHash },
      { refreshTokenHash: newHash },
    );
  }

  public updateRefreshTokenHash(id: string, oldHash: string, newHash: string): Promise<UpdateResult> {
    return this.rotateRefreshToken(id, oldHash, newHash);
  }

  public compareAndSwapRefreshToken(id: string, oldHash: string, newHash: string): Promise<UpdateResult> {
    return this.rotateRefreshToken(id, oldHash, newHash);
  }

  public withManager(entityManager: EntityManager): SessionRepository {
    return new SessionRepository(entityManager.getRepository(SessionEntity));
  }
}
