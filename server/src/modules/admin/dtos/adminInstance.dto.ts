import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AdminUserSummaryResponseDto } from "./adminUserSummary.dto";
import { InstanceEntity, InstanceStatus } from "src/modules/instances/instance.entity";
import { Type } from "class-transformer";

export class AdminInstanceIdParamsDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id da instância",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public id!: InstanceEntity["id"];
}

export class AdminInstancesQueryDto {
  @ApiPropertyOptional({
    type: "string",
    format: "uuid",
    description: "Filtra instâncias de um usuário específico",
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
    description: "Quantidade máxima de instâncias retornadas",
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
    description: "Quantidade de instâncias ignoradas",
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public offset: number = 0;
}

export class AdminInstanceResponseDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id da instância",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  public id!: InstanceEntity["id"];

  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "id do usuário dono da instância",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  public userId!: InstanceEntity["userId"];

  @ApiProperty({ type: AdminUserSummaryResponseDto, description: "Dados do usuário dono da instância" })
  public user!: AdminUserSummaryResponseDto;

  @ApiProperty({
    enum: InstanceStatus,
    enumName: "InstanceLifecycleStatus",
    description: "Status do provisionamento da instância",
    example: InstanceStatus.PENDING,
  })
  public status!: InstanceEntity["status"];

  @ApiProperty({
    type: "string",
    description: "Nome do container Docker que executa a instância",
    example: "pocketdock-instance-123e4567-e89b-12d3-a456-426614174000",
  })
  public containerName!: InstanceEntity["containerName"];

  @ApiProperty({
    type: "string",
    description: "URL base da instância",
    example: "https://123e4567-e89b-12d3-a456-426614174000.app.example.com",
  })
  public url!: string;

  @ApiProperty({
    type: "string",
    format: "date-time",
    description: "Data de criação",
    example: "2024-01-01T00:00:00.000Z",
  })
  public createdAt!: InstanceEntity["createdAt"];

  @ApiProperty({
    type: "string",
    format: "date-time",
    description: "Data de atualização",
    example: "2024-01-01T00:00:00.000Z",
  })
  public updatedAt!: InstanceEntity["updatedAt"];
}

export class AdminInstanceListResponseDto {
  @ApiProperty({ type: AdminInstanceResponseDto, isArray: true })
  public items!: AdminInstanceResponseDto[];

  @ApiProperty({ type: "integer", description: "Total de instâncias", example: 42 })
  public total!: number;

  @ApiProperty({ type: "integer", description: "Limite aplicado", example: 20 })
  public limit!: number;

  @ApiProperty({ type: "integer", description: "Offset aplicado", example: 0 })
  public offset!: number;
}
