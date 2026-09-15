import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { InstanceEntity } from "../instance.entity";
import { ApiProperty } from "@nestjs/swagger";

export class InstanceIDParamsDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "ID da instância",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public ID!: InstanceEntity["ID"];
}

export class InstancePrivateDto {
  @ApiProperty({
    type: "string",
    format: "uuid",
    description: "ID da instância",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  public ID!: InstanceEntity["ID"];

  @ApiProperty({
    type: "string",
    description: "Nome do container Docker que executa a instância",
    example: "pocketdock-instance-123e4567-e89b-12d3-a456-426614174000",
  })
  public containerName!: InstanceEntity["containerName"];

  @ApiProperty({
    type: "string",
    description: "Senha default do superuser da instância (trocar após o primeiro acesso)",
    example: "8f14e45fceea167a5a36dedd4bea2543a18f9dd4c4c8e55f8b7f0e0b3c1d0c28",
  })
  public defaultPassword!: InstanceEntity["defaultPassword"];

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

  @ApiProperty({
    type: "string",
    description: "URL base da instância",
    example: "https://123e4567-e89b-12d3-a456-426614174000.app.example.com",
  })
  public url!: string;
}

export class InstanceStatsDto {
  @ApiProperty({
    type: "object",
    properties: {
      percent: { type: "number", example: 12.34 },
      limit: { type: "number", example: 4 },
      used: { type: "number", example: 1.5 },
    },
  })
  public cpu!: { percent: number; limit: number; used: number };

  @ApiProperty({
    type: "object",
    properties: {
      percent: { type: "number", example: 25.6 },
      limit: { type: "number", example: 512 },
      used: { type: "number", example: 131.2 },
    },
  })
  public memory!: { percent: number; limit: number; used: number };

  @ApiProperty({
    enum: ["running", "stopped"],
    enumName: "InstanceStatus",
    description: "Status simplificado da instância (rodando ou parada)",
    example: "running",
  })
  public status!: "running" | "stopped";
}
