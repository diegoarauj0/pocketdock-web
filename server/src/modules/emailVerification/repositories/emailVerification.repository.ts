import { EmailVerificationEntity, EmailVerificationType } from "../emailVerification.entity";
import { DeleteResult, EntityManager, LessThan, UpdateResult } from "typeorm/browser";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class EmailVerificationRepository {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
  ) {}

  public findByTypeAndEmailAndNotRevoked(
    type: EmailVerificationType,
    email: string,
  ): Promise<EmailVerificationEntity | null> {
    return this.emailVerificationRepository.findOne({ where: { email: email, type: type, revoked: false } });
  }

  public revoke(id: string): Promise<UpdateResult> {
    return this.emailVerificationRepository.update({ id: id, revoked: false }, { revoked: true });
  }

  public create(props: Partial<EmailVerificationEntity>): EmailVerificationEntity {
    return this.emailVerificationRepository.create(props);
  }

  public save(emailVerification: EmailVerificationEntity): Promise<EmailVerificationEntity> {
    return this.emailVerificationRepository.save(emailVerification);
  }

  public revokeExpired(now: Date): Promise<UpdateResult> {
    return this.emailVerificationRepository.update({ revoked: false, expiresAt: LessThan(now) }, { revoked: true });
  }

  public deleteOlderThan(date: Date): Promise<DeleteResult> {
    return this.emailVerificationRepository.delete({ expiresAt: LessThan(date) });
  }

  public withManager(entityManager: EntityManager): EmailVerificationRepository {
    return new EmailVerificationRepository(entityManager.getRepository(EmailVerificationEntity));
  }
}
