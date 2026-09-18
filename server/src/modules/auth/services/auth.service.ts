import { InvalidCredentialException, InvalidCredentialReason } from "../exceptions/invalidCredential.exception";
import { EmailVerificationService } from "src/modules/emailVerification/services/emailVerification.service";
import { EmailVerificationType } from "src/modules/emailVerification/emailVerification.entity";
import { PasswordService } from "src/common/services/password.service";
import { UsersService } from "src/modules/users/services/users.service";
import { UserEntity } from "src/modules/users/user.entity";
import { Locale } from "src/modules/mail/mail.constant";
import { AUTH_CONSTANT } from "../auth.constant";
import { Injectable } from "@nestjs/common";

interface InterfaceEmailAndPasswordProps {
  password: string;
  email: string;
}

interface InterfaceSignUpProps {
  username: string;
  password: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordService: PasswordService,
    private readonly usersService: UsersService,
  ) {}

  public async signIn(props: InterfaceEmailAndPasswordProps): Promise<UserEntity> {
    const { email, password } = props;

    const user = await this.usersService.findByEmail(email);

    const result = await this.passwordService.compare(password, user?.hash ?? AUTH_CONSTANT.DUMMY_PASSWORD_HASH);

    if (user === null) {
      throw new InvalidCredentialException(InvalidCredentialReason.USER_NOT_FOUND);
    }

    if (user.emailVerified === false) {
      throw new InvalidCredentialException(InvalidCredentialReason.EMAIL_NOT_VERIFIED);
    }

    if (result === false) {
      throw new InvalidCredentialException(InvalidCredentialReason.INVALID_PASSWORD);
    }

    return user;
  }

  public async signUp(props: InterfaceSignUpProps, locale: Locale): Promise<void> {
    const { email, password, username } = props;

    const existsUser = await this.usersService.findByEmail(email);

    const hash = await this.passwordService.hash(password);

    if (existsUser) return;

    const user = await this.usersService.create(email, username, hash);

    await this.emailVerificationService.send({
      emailVerificationType: EmailVerificationType.SIGN_UP,
      userId: user.id,
      email: email,
      locale: locale,
    });
  }

  public async forgotPassword(props: InterfaceEmailAndPasswordProps, locale: Locale): Promise<void> {
    const { email, password } = props;

    const user = await this.usersService.findByEmail(email);

    const hash = await this.passwordService.hash(password);

    if (user === null) return;

    await this.emailVerificationService.send({
      emailVerificationType: EmailVerificationType.FORGOT_PASSWORD,
      payload: { hash: hash },
      userId: user.id,
      email: email,
      locale: locale,
    });
  }
}
