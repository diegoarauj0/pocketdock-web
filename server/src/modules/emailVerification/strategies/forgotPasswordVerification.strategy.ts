import { UsersService } from "src/modules/users/services/users.service";
import { EmailVerificationType } from "../emailVerification.entity";
import { InterfaceBaseVerificationStrategy } from "./base.strategy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ForgotPasswordVerificationStrategy implements InterfaceBaseVerificationStrategy<{ hash: string }> {
  public readonly emailVerificationType = EmailVerificationType.FORGOT_PASSWORD;

  constructor(private readonly usersService: UsersService) {}

  public async execute(_, userId: string, payload: { hash: string }): Promise<void> {
    await this.usersService.updateHash(userId, payload.hash);
  }
}
