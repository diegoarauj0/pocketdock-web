import { AccountsRepository } from "./repositories/accounts.repository";
import { AccountsService } from "./services/accounts.service";
import { AccountEntity } from "./account.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountsRepository, AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
