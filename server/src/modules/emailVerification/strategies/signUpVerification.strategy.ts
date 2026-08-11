import { EmailVerificationType } from "../emailVerification.entity";
import { UsersService } from "src/modules/users/services/users.service";
import { InterfaceBaseVerificationStrategy } from "./base.strategy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SignUpVerificationStrategy implements InterfaceBaseVerificationStrategy {
  public readonly emailVerificationType = EmailVerificationType.SIGN_UP;

  constructor(private readonly usersService: UsersService) {}

  public async execute(_, userID: string): Promise<void> {
    await this.usersService.verifyEmailByID(userID);
  }
}
