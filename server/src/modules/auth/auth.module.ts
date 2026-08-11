import { EmailVerificationModule } from "../emailVerification/emailVerification.module";
import { GoogleOAuthStrategy } from "./strategies/google.strategy";
import { OAuthStrategyRegistry } from "./oAuthStrategy.registry";
import { OAuthController } from "./controllers/OAuth.controller";
import { AuthController } from "./controllers/auth.controller";
import { AccountsModule } from "../accounts/accounts.module";
import { SessionModule } from "../session/session.module";
import { OAuthService } from "./services/OAuth.service";
import { CommonModule } from "src/common/common.module";
import { AuthService } from "./services/auth.service";
import { UsersModule } from "../users/users.module";
import { Module, Provider } from "@nestjs/common";
import { AuthGuard } from "./guards/auth.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [CommonModule, EmailVerificationModule, UsersModule, SessionModule, AccountsModule],
  controllers: [AuthController, OAuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    OAuthService,
    OAuthStrategyRegistry,
    GoogleOAuthStrategy,
  ],
})
export class AuthModule {}
