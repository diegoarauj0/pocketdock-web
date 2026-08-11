import { PublicUserResponseDto } from "./dtos/user.dto";
import { UserEntity } from "./user.entity";

export class UserMapper {
  public static toPublic(user: UserEntity): PublicUserResponseDto {
    return {
      ID: user.ID,
      username: user.username,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
  }
}
