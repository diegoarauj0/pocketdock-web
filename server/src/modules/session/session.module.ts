import { CommonModule } from "src/common/common.module";
import { SessionRepository } from "./repositories/session.repository";
import { SessionService } from "./services/session.service";
import { SessionEntity } from "./session.entity";
import { JWTService } from "./services/jwt.service";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([SessionEntity]), UsersModule],
  providers: [SessionService, SessionRepository, JWTService],
  exports: [SessionService, SessionRepository],
})
export class SessionModule {}
