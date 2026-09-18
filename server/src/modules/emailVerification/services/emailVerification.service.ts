import { CryptoService } from "src/common/services/crypto.service";
import { EmailVerificationEntity, EmailVerificationType } from "../emailVerification.entity";
import * as invalidEmailVerificationCode from "../exceptions/invalidEmailVerificationCode.exception";
import * as concurrentEmailVerification from "../exceptions/concurrentEmailVerification.exception";
import { isUniqueConstraintError } from "src/infrastructure/database/helpers/isUniqueConstraintError";
import { EmailVerificationRepository } from "../repositories/emailVerification.repository";
import { MailTranslationService } from "src/modules/mail/services/mailTranslation.service";
import { VerificationStrategyRegistry } from "../verificationStrategy.registry";
import { EMAIL_VERIFICATION_CONSTANT } from "../emailVerification.constant";
import { MailService } from "src/modules/mail/services/mail.service";
import { Locale } from "src/modules/mail/mail.constant";
import { Injectable, Logger } from "@nestjs/common";

interface InterfaceSendProps {
  emailVerificationType: EmailVerificationType;
  payload?: Record<string, unknown>;
  userId: string;
  email: string;
  locale: Locale;
}

interface InterfaceResendProps {
  emailVerificationType: EmailVerificationType;
  email: string;
  locale: Locale;
}

interface InterfaceSendEmailProps {
  emailVerificationType: EmailVerificationType;
  locale: Locale;
  email: string;
  code: string;
}

interface InterfaceVerifyProps {
  emailVerificationType: EmailVerificationType;
  email: string;
  code: string;
}

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly verificationStrategyRegistry: VerificationStrategyRegistry,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly mailTranslationService: MailTranslationService,
    private readonly mailService: MailService,
  ) {}

  public async resend(props: InterfaceResendProps): Promise<void> {
    const { emailVerificationType, email, locale } = props;

    const existsEmailVerification = await this.emailVerificationRepository.findByTypeAndEmailAndNotRevoked(
      emailVerificationType,
      email,
    );

    if (existsEmailVerification === null) {
      return this.logger.debug("Cannot resend verification email because no active verification exists", {
        emailVerificationType,
        email,
      });
    }

    const { affected } = await this.emailVerificationRepository.revoke(existsEmailVerification.id);

    if (affected === undefined || affected === 0) {
      throw new concurrentEmailVerification.ConcurrentEmailVerificationException(
        concurrentEmailVerification.ConcurrentEmailVerificationReason.REVOKE_RACE_LOST,
      );
    }

    const code = this.cryptoService.createRandomCode(EMAIL_VERIFICATION_CONSTANT.CODE_LENGTH);
    const hash = this.cryptoService.hash(`${email}:${code}`);

    try {
      const emailVerification = this.emailVerificationRepository.create({
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_CONSTANT.EXPIRES_IN_MS),
        payload: existsEmailVerification.payload,
        userId: existsEmailVerification.userId,
        type: emailVerificationType,
        revoked: false,
        email: email,
        hash: hash,
      });

      await this.emailVerificationRepository.save(emailVerification);

      await this.sendEmail({ emailVerificationType, email, code, locale });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new concurrentEmailVerification.ConcurrentEmailVerificationException(
          concurrentEmailVerification.ConcurrentEmailVerificationReason.DUPLICATE_ACTIVE_VERIFICATION,
        );
      }

      throw error;
    }
  }

  public async send(props: InterfaceSendProps): Promise<void> {
    const { emailVerificationType, userId, email, payload, locale } = props;

    const existsEmailVerification = await this.emailVerificationRepository.findByTypeAndEmailAndNotRevoked(
      emailVerificationType,
      email,
    );

    if (existsEmailVerification) {
      return this.logger.debug("Verification email was not created because an active verification already exists", {
        emailVerificationType,
        email,
      });
    }

    const code = this.cryptoService.createRandomCode(EMAIL_VERIFICATION_CONSTANT.CODE_LENGTH);

    const hash = this.cryptoService.hash(`${email}:${code}`);

    try {
      const emailVerification = this.emailVerificationRepository.create({
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_CONSTANT.EXPIRES_IN_MS),
        type: emailVerificationType,
        payload: payload,
        userId: userId,
        revoked: false,
        email: email,
        hash: hash,
      });

      await this.emailVerificationRepository.save(emailVerification);

      await this.sendEmail({ emailVerificationType, email, code, locale });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new concurrentEmailVerification.ConcurrentEmailVerificationException(
          concurrentEmailVerification.ConcurrentEmailVerificationReason.DUPLICATE_ACTIVE_VERIFICATION,
        );
      }

      throw error;
    }
  }

  public async execute(props: InterfaceVerifyProps): Promise<EmailVerificationEntity> {
    const { code, emailVerificationType, email } = props;

    const emailVerification = await this.verifyAndRevoke({ emailVerificationType, code, email });

    const payload = emailVerification.payload;
    const userId = emailVerification.userId;

    await this.verificationStrategyRegistry.strategies[emailVerificationType].execute(email, userId, payload);

    return emailVerification;
  }

  private async sendEmail(props: InterfaceSendEmailProps): Promise<void> {
    const { emailVerificationType, locale, email, code } = props;

    const content = await this.mailTranslationService.translate(locale, emailVerificationType);

    await this.mailService.send({
      subject: content.subject,
      template: "verificationCodeEmail",
      to: email,
      context: {
        code: code,
        lang: locale,
        greetingPrefix: content.greetingPrefix,
        preheaderText: content.preheaderText,
        title: content.title,
        description: content.description,
        expiresInMessage: content.expiresInMessage,
      },
    });
  }

  private async verifyAndRevoke(props: InterfaceVerifyProps): Promise<EmailVerificationEntity> {
    const { code, emailVerificationType, email } = props;

    const emailVerification = await this.emailVerificationRepository.findByTypeAndEmailAndNotRevoked(
      emailVerificationType,
      email,
    );

    const hash = this.cryptoService.hash(`${email}:${code}`);

    if (emailVerification === null) {
      throw new invalidEmailVerificationCode.InvalidEmailVerificationCodeException(
        invalidEmailVerificationCode.InvalidEmailVerificationCodeReason.NOT_FOUND,
      );
    }

    if (this.cryptoService.timingSafeEqual(emailVerification.hash, hash) === false) {
      throw new invalidEmailVerificationCode.InvalidEmailVerificationCodeException(
        invalidEmailVerificationCode.InvalidEmailVerificationCodeReason.INVALID_CODE,
      );
    }

    if (emailVerification.expiresAt < new Date()) {
      await this.emailVerificationRepository.revoke(emailVerification.id);

      throw new invalidEmailVerificationCode.InvalidEmailVerificationCodeException(
        invalidEmailVerificationCode.InvalidEmailVerificationCodeReason.EXPIRED,
      );
    }

    const { affected } = await this.emailVerificationRepository.revoke(emailVerification.id);

    if (affected === 0 || affected === undefined) {
      throw new invalidEmailVerificationCode.InvalidEmailVerificationCodeException(
        invalidEmailVerificationCode.InvalidEmailVerificationCodeReason.ALREADY_USED,
      );
    }

    return emailVerification;
  }
}
