import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/modules/users/user.entity";

export class AdminUserSummaryResponseDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  public id!: UserEntity["id"];

  @ApiProperty({ type: "string", description: "Nome de usuário", example: "victor" })
  public username!: UserEntity["username"];

  @ApiProperty({ type: "string", description: "E-mail truncado", example: "vi***@exemplo.com" })
  public email!: string;
}
