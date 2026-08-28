import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { InstanceEntity } from "../instance.entity";

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
    description: "ID do container Docker que executa a instância",
    example: "pocketdock-instance-123e4567-e89b-12d3-a456-426614174000",
  })
  public containerId!: InstanceEntity["containerName"];

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
