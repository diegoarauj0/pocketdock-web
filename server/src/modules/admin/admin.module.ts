import { AdminBootstrapService } from "./services/adminBootstrap.service";
import { SessionModule } from "src/modules/sessions/session.module";
import { InstanceModule } from "src/modules/instances/instance.module";
import { UsersModule } from "src/modules/users/users.module";
import { AdminController } from "./controllers/admin.controller";
import { AdminService } from "./services/admin.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [UsersModule, InstanceModule, SessionModule],
  controllers: [AdminController],
  providers: [AdminService, AdminBootstrapService],
})
export class AdminModule {}
