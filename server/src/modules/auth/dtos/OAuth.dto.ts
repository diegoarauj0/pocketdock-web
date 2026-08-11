import { ApiProperty } from "@nestjs/swagger";
import { OAuthStrategyID } from "../strategies/base.strategy";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class StrategyIDParamsDto {
  @ApiProperty({
    enum: OAuthStrategyID,
    description: "ID da estratégia OAuth",
    example: OAuthStrategyID.GOOGLE,
  })
  @IsNotEmpty()
  @IsEnum(OAuthStrategyID)
  public strategyID!: OAuthStrategyID;
}

export class CallbackQueriesDto {
  @ApiProperty({
    type: "string",
    description: "Estado de verificação gerado na autorização OAuth",
    example: "eyJzdGF0ZSI6ImFiY2RlZiJ9",
  })
  @IsString()
  @IsNotEmpty()
  public state!: string;

  @ApiProperty({
    type: "string",
    description: "Código de autorização retornado pelo provedor OAuth",
    example: "4/0AanRRir-a0FJXhKz5zC",
  })
  @IsString()
  @IsNotEmpty()
  public code!: string;
}

export class AuthorizeResponseDto {
  @ApiProperty({
    type: "string",
    format: "url",
    description: "URL de autorização do provedor OAuth",
    example: "https://accounts.google.com/o/oauth2/v2/auth?response_type=code",
  })
  public authorizeURL!: string;

  @ApiProperty({
    enum: OAuthStrategyID,
    description: "ID da estratégia OAuth",
    example: OAuthStrategyID.GOOGLE,
  })
  public strategyID!: OAuthStrategyID;
}
