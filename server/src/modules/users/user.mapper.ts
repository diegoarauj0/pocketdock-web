import { PublicUserResponseDto } from "./dtos/user.dto";
import { UserEntity } from "./user.entity";

export class UserMapper {
  public static toPublic(user: UserEntity): PublicUserResponseDto {
    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
  }
}
