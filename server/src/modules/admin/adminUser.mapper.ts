import { AdminUserResponseDto } from "./dtos/adminUser.dto";
import { maskEmail } from "./helpers/maskEmail.helper";
import { UserEntity } from "src/modules/users/user.entity";

export class AdminUserMapper {
  public static toResponse(user: UserEntity): AdminUserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: maskEmail(user.email),
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
