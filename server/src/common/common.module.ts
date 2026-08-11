import { CryptoService } from "./services/crypto.service";
import { PasswordService } from "./services/password.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [CryptoService, PasswordService],
  exports: [CryptoService, PasswordService],
})
export class CommonModule {}
