import { LockService } from "./services/lock.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [LockService],
  exports: [LockService],
})
export class LockModule {}
