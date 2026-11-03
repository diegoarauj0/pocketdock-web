import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { UserEntity } from "src/modules/users/user.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AdminUserIdParamsDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public id!: UserEntity["id"];
}

export class AdminUsersQueryDto {
  @ApiPropertyOptional({
    type: "integer",
    minimum: 1,
    maximum: 100,
    default: 20,
    description: "Quantidade máxima de usuários retornados",
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public limit: number = 20;

  @ApiPropertyOptional({
    type: "integer",
    minimum: 0,
    default: 0,
    description: "Quantidade de usuários ignorados",
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public offset: number = 0;
}

export class AdminUserResponseDto {
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

  @ApiProperty({ type: "boolean", description: "Indica se o e-mail foi verificado", example: true })
  public emailVerified!: UserEntity["emailVerified"];

  @ApiProperty({ type: "boolean", description: "Indica se o usuário é administrador", example: false })
  public isAdmin!: UserEntity["isAdmin"];

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

export class AdminUserListResponseDto {
  @ApiProperty({ type: AdminUserResponseDto, isArray: true })
  public items!: AdminUserResponseDto[];

  @ApiProperty({ type: "integer", description: "Total de usuários", example: 42 })
  public total!: number;

  @ApiProperty({ type: "integer", description: "Limite aplicado", example: 20 })
  public limit!: number;

  @ApiProperty({ type: "integer", description: "Offset aplicado", example: 0 })
  public offset!: number;
}
