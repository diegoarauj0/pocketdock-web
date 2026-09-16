import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../user.entity";

export class PublicUserResponseDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  public id!: UserEntity["id"];

  @ApiProperty({ type: "string", description: "Nome de usuário", example: "victor" })
  public username!: UserEntity["username"];

  @ApiProperty({
    type: "string",
    format: "date-time",
    description: "Data de criação",
    example: "2024-01-01T00:00:00.000Z",
  })
  public createdAt!: UserEntity["createdAt"];

  @ApiProperty({
    type: "string",
    format: "date-time",
    description: "Data de atualização",
    example: "2024-01-01T00:00:00.000Z",
  })
  public updatedAt!: UserEntity["updatedAt"];
}
