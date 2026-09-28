import { EMAIL_VERIFICATION_CONSTANT } from "src/modules/emailVerification/emailVerification.constant";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { PASSWORD_CONSTANT } from "src/common/password.constant";
import { USER_CONSTANT } from "src/modules/users/user.constant";
import { ApiProperty } from "@nestjs/swagger";

export class EmailAndPasswordDto {
  @ApiProperty({ type: "string", format: "email", description: "E-mail do usuário", example: "diegoaraujo@email.com" })
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @ApiProperty({
    type: "string",
    format: "password",
    description: `Senha do usuário`,
    minLength: PASSWORD_CONSTANT.MIN_LENGTH,
    maxLength: PASSWORD_CONSTANT.MAX_LENGTH,
    example: "senha-segura-123",
  })
  @IsString()
  @MinLength(PASSWORD_CONSTANT.MIN_LENGTH)
  @MaxLength(PASSWORD_CONSTANT.MAX_LENGTH)
  @IsNotEmpty()
  public password!: string;
}

export class SignUpBodyDto extends EmailAndPasswordDto {
  @ApiProperty({
    type: "string",
    description: `Nome de usuário (entre ${USER_CONSTANT.USERNAME_MIN_LENGTH} e ${USER_CONSTANT.USERNAME_MAX_LENGTH} caracteres)`,
    minLength: USER_CONSTANT.USERNAME_MIN_LENGTH,
    maxLength: USER_CONSTANT.USERNAME_MAX_LENGTH,
    example: "diegoaraujo",
  })
  @IsString()
  @MinLength(USER_CONSTANT.USERNAME_MIN_LENGTH)
  @MaxLength(USER_CONSTANT.USERNAME_MAX_LENGTH)
  @IsNotEmpty()
  public username!: string;
}

export class EmailBodyDto {
  @ApiProperty({ type: "string", format: "email", description: "E-mail do usuário", example: "diegoaraujo@email.com" })
  @IsEmail()
  @IsNotEmpty()
  public email!: string;
}

export class VerifyEmailBodyDto {
  @ApiProperty({ type: "string", format: "email", description: "E-mail do usuário", example: "diegoaraujo@email.com" })
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @ApiProperty({
    type: "string",
    description: "Código de verificação enviado por e-mail",
    minLength: EMAIL_VERIFICATION_CONSTANT.CODE_LENGTH,
    maxLength: EMAIL_VERIFICATION_CONSTANT.CODE_LENGTH,
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(EMAIL_VERIFICATION_CONSTANT.CODE_LENGTH)
  @MaxLength(EMAIL_VERIFICATION_CONSTANT.CODE_LENGTH)
  public code!: string;
}

export class TokenResponseDto {
  @ApiProperty({
    type: "string",
    description: "Token de acesso JWT",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  })
  public access!: string;

  @ApiProperty({
    type: "number",
    description: "Tempo de expiração do token de acesso em milissegundos",
    example: 900000,
  })
  public expiresIn!: number;
}
