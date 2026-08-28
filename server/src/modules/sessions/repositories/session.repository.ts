import { SessionEntity, SessionRevokeType } from "../session.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, EntityManager, LessThan, UpdateResult } from "typeorm/browser";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  public findByID(ID: string): Promise<SessionEntity | null> {
    return this.sessionRepository.findOne({ where: { ID: ID } });
  }

  public create(props: Partial<SessionEntity>): SessionEntity {
    return this.sessionRepository.create(props);
  }

  public save(session: SessionEntity): Promise<SessionEntity> {
    return this.sessionRepository.save(session);
  }

  public revokeByID(ID: string, revokeType: SessionRevokeType): Promise<UpdateResult> {
    return this.sessionRepository.update(
      { ID: ID, revoked: false },
      { revoked: true, revokeType: revokeType, revokedAt: new Date() },
    );
  }

  public revokeAllByUserID(userID: string, revokeType: SessionRevokeType): Promise<UpdateResult> {
    return this.sessionRepository.update(
      { userID: userID, revoked: false },
      { revoked: true, revokeType: revokeType, revokedAt: new Date() },
    );
  }

  public deleteExpiredBefore(date: Date): Promise<DeleteResult> {
    return this.sessionRepository.delete({ expiresAt: LessThan(date) });
  }

  public deleteRevokedBefore(date: Date): Promise<DeleteResult> {
    return this.sessionRepository.delete({ revoked: true, revokedAt: LessThan(date) });
  }

  public withManager(entityManager: EntityManager): SessionRepository {
    return new SessionRepository(entityManager.getRepository(SessionEntity));
  }
}
