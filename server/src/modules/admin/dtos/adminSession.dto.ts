import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AdminUserSummaryResponseDto } from "./adminUserSummary.dto";
import { SessionEntity, SessionRevokeType } from "src/modules/sessions/session.entity";
import { Type } from "class-transformer";

export class AdminSessionIdParamsDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id da sessão",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public id!: SessionEntity["id"];
}

export class AdminSessionsQueryDto {
  @ApiPropertyOptional({
    type: "string",
    format: "uuid",
    description: "Filtra sessões de um usuário específico",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsUUID()
  public userId?: string;

  @ApiPropertyOptional({
    type: "integer",
    minimum: 1,
    maximum: 100,
    default: 20,
    description: "Quantidade máxima de sessões retornadas",
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
    description: "Quantidade de sessões ignoradas",
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public offset: number = 0;
}

export class AdminSessionResponseDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id da sessão",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  public id!: SessionEntity["id"];

  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id do usuário dono da sessão",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  public userId!: SessionEntity["userId"];

  @ApiProperty({ type: AdminUserSummaryResponseDto, description: "Dados do usuário dono da sessão" })
  public user!: AdminUserSummaryResponseDto;

  @ApiProperty({
    type: "string",
    format: "date-time",
    description: "Data de expiração da sessão",
    example: "2024-01-01T00:00:00.000Z",
  })
  public expiresAt!: SessionEntity["expiresAt"];

  @ApiProperty({ type: "boolean", description: "Indica se a sessão foi revogada", example: false })
  public revoked!: SessionEntity["revoked"];

  @ApiProperty({
    type: "string",
    format: "date-time",
    nullable: true,
    description: "Data de revogação da sessão",
    example: null,
  })
  public revokedAt!: SessionEntity["revokedAt"];

  @ApiProperty({
    enum: SessionRevokeType,
    enumName: "SessionRevokeType",
    nullable: true,
    description: "Motivo da revogação da sessão",
    example: SessionRevokeType.LOGOUT,
  })
  public revokeType!: SessionEntity["revokeType"];

  @ApiProperty({
    type: "string",
    nullable: true,
    description: "IP truncado da sessão",
    example: "192.168.0.xxx",
  })
  public ipAddress!: SessionEntity["ipAddress"];

  @ApiProperty({
    type: "string",
    nullable: true,
    description: "User-agent truncado da sessão",
    example: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36...",
  })
  public userAgent!: SessionEntity["userAgent"];

  @ApiProperty({
    type: "string",
    format: "date-time",
    description: "Data de criação",
    example: "2024-01-01T00:00:00.000Z",
  })
  public createdAt!: SessionEntity["createdAt"];

  @ApiProperty({
    type: "string",
    format: "date-time",
    description: "Data de atualização",
    example: "2024-01-01T00:00:00.000Z",
  })
  public updatedAt!: SessionEntity["updatedAt"];
}

export class AdminSessionListResponseDto {
  @ApiProperty({ type: AdminSessionResponseDto, isArray: true })
  public items!: AdminSessionResponseDto[];

  @ApiProperty({ type: "integer", description: "Total de sessões", example: 42 })
  public total!: number;

  @ApiProperty({ type: "integer", description: "Limite aplicado", example: 20 })
  public limit!: number;

  @ApiProperty({ type: "integer", description: "Offset aplicado", example: 0 })
  public offset!: number;
}
