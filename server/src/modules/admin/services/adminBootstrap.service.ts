import { UserNotFoundException } from "src/modules/users/exceptions/userNotFoundException.exception";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { UsersService } from "src/modules/users/services/users.service";
import { env } from "src/config/env";

@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(private readonly usersService: UsersService) {}

  public async onApplicationBootstrap(): Promise<void> {
    for (const email of env.BOOTSTRAP_ADMIN_EMAIL) {
      const user = await this.usersService.findByEmail(email);

      if (user === null) {
        this.logger.log(`Bootstrap admin skipped: user not found (${email}).`);
        continue;
      }

      if (user.isAdmin === true) continue;

      try {
        await this.usersService.promoteToAdmin(user.id);
        this.logger.log(`Bootstrap admin promoted: ${email}.`);
      } catch (error) {
        if (error instanceof UserNotFoundException) {
          this.logger.log(`Bootstrap admin skipped: user not found (${email}).`);
          continue;
        }

        throw error;
      }
    }
  }
}
