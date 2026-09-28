import { UsersRepository } from "./repositories/users.repository";
import { UsersController } from "./controllers/users.controller";
import { InstanceModule } from "../instances/instance.module";
import { CommonModule } from "src/common/common.module";
import { UsersService } from "./services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Module } from "@nestjs/common";

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([UserEntity]), InstanceModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
