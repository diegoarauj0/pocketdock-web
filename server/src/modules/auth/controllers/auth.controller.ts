import { ApiInvalidEmailVerificationCodeResponse } from "src/common/decorators/swagger/invalidEmailVerificationCode.decorator";
import { ApiConcurrentEmailVerificationResponse } from "src/common/decorators/swagger/concurrentEmailVerification.decorator";
import { ApiBearerAuth, ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { EmailVerificationService } from "src/modules/emailVerification/services/emailVerification.service";
import { ApiInvalidCredentialResponse } from "src/common/decorators/swagger/invalidCredential.decorator";
import { ApiInvalidSessionResponse } from "src/common/decorators/swagger/invalidSession.decorator";
import { ApiInvalidTokenResponse } from "src/common/decorators/swagger/invalidToken.decorator";
import { EmailVerificationType } from "src/modules/emailVerification/emailVerification.entity";
import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post, Res } from "@nestjs/common";
import { ApiValidationResponse } from "src/common/decorators/swagger/validation.decorator";
import { AcceptLanguage } from "src/common/decorators/acceptLanguage.decorator";
import { SessionService } from "src/modules/sessions/services/session.service";
import { SuccessResponseDto } from "src/common/dtos/successResponse.dto";
import { AllowAnonymous } from "../decorators/allowAnonymous.decorator";
import { SESSION_CONSTANT } from "src/modules/sessions/session.constant";
import { PublicUserResponseDto } from "src/modules/users/dtos/user.dto";
import { resolveLocale } from "src/modules/mail/helpers/resolveLocale";
import { UserAgent } from "src/common/decorators/userAgent.decorator";
import { Cookie } from "src/common/decorators/cookie.decorator";
import { UserEntity } from "src/modules/users/user.entity";
import { UserMapper } from "src/modules/users/user.mapper";
import { Session } from "../decorators/session.decorator";
import { AuthService } from "../services/auth.service";
import * as DTOs from "../dtos/auth.dto";
import type { Response } from "express";
import { env } from "src/config/env";

@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: "Verificar código de recuperação de senha",
    description: "Valida o e-mail e o código de verificação enviado ao usuário durante a recuperação de senha.",
  })
  @ApiOkResponse({ description: "Código de verificação validado com sucesso.", type: SuccessResponseDto() })
  @AllowAnonymous()
  @ApiValidationResponse()
  @HttpCode(HttpStatus.OK)
  @Post("forgot-password/verify")
  @ApiInvalidEmailVerificationCodeResponse()
  public async forgotPasswordVerifyEmail(@Body() body: DTOs.VerifyEmailBodyDto): Promise<void> {
    await this.emailVerificationService.execute({
      emailVerificationType: EmailVerificationType.FORGOT_PASSWORD,
      email: body.email,
      code: body.code,
    });
  }

  @ApiOperation({
    summary: "Reenviar código de recuperação de senha",
    description: "Envia novamente o código de verificação por e-mail para o usuário redefinir a senha.",
  })
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  @ApiValidationResponse()
  @ApiConcurrentEmailVerificationResponse()
  @Post("forgot-password/resend")
  @ApiOkResponse({ type: SuccessResponseDto() })
  public async forgotPasswordResendEmail(
    @Body() body: DTOs.EmailBodyDto,
    @AcceptLanguage() acceptLanguage: string | undefined,
  ): Promise<void> {
    await this.emailVerificationService.resend({
      emailVerificationType: EmailVerificationType.FORGOT_PASSWORD,
      email: body.email,
      locale: resolveLocale(acceptLanguage),
    });
  }

  @ApiOperation({
    summary: "Recuperar senha",
    description: "Inicia o fluxo de recuperação de senha enviando um código de verificação por e-mail.",
  })
  @AllowAnonymous()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiValidationResponse()
  @ApiConcurrentEmailVerificationResponse()
  @ApiOkResponse({ type: SuccessResponseDto() })
  public async forgotPassword(
    @Body() body: DTOs.EmailAndPasswordDto,
    @AcceptLanguage() acceptLanguage: string | undefined,
  ): Promise<void> {
    await this.authService.forgotPassword(body, resolveLocale(acceptLanguage));
  }

  @ApiOperation({
    summary: "Verificar e-mail de cadastro",
    description: "Valida o e-mail e o código de verificação do cadastro, cria a sessão e retorna o token de acesso.",
  })
  @AllowAnonymous()
  @Post("sign-up/verify")
  @HttpCode(HttpStatus.OK)
  @ApiValidationResponse()
  @ApiInvalidEmailVerificationCodeResponse()
  @ApiOkResponse({ type: SuccessResponseDto(DTOs.TokenResponseDto) })
  public async signUpVerifyEmail(
    @Res({ passthrough: true }) res: Response,
    @Body() body: DTOs.VerifyEmailBodyDto,
    @UserAgent() userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<DTOs.TokenResponseDto> {
    const emailVerification = await this.emailVerificationService.execute({
      emailVerificationType: EmailVerificationType.SIGN_UP,
      email: body.email,
      code: body.code,
    });

    const { access, refresh } = await this.sessionService.create({
      userId: emailVerification.userId,
      ipAddress,
      userAgent,
    });

    this.setRefreshCookie(refresh, res);

    return { access, expiresIn: SESSION_CONSTANT.ACCESS_EXPIRES_IN_MS };
  }

  @ApiOperation({
    summary: "Reenviar código de cadastro",
    description: "Envia novamente o código de verificação por e-mail para concluir o cadastro.",
  })
  @AllowAnonymous()
  @Post("sign-up/resend")
  @ApiValidationResponse()
  @ApiConcurrentEmailVerificationResponse()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SuccessResponseDto() })
  public async signUpResendEmail(
    @Body() body: DTOs.EmailBodyDto,
    @AcceptLanguage() acceptLanguage: string | undefined,
  ): Promise<void> {
    await this.emailVerificationService.resend({
      emailVerificationType: EmailVerificationType.SIGN_UP,
      email: body.email,
      locale: resolveLocale(acceptLanguage),
    });
  }

  @ApiOperation({
    summary: "Cadastrar usuário",
    description: "Cria um novo usuário com e-mail, senha e nome de usuário e envia o código de verificação por e-mail.",
  })
  @Post("sign-up")
  @AllowAnonymous()
  @ApiValidationResponse()
  @ApiConcurrentEmailVerificationResponse()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: SuccessResponseDto() })
  public async signUp(
    @Body() body: DTOs.SignUpBodyDto,
    @AcceptLanguage() acceptLanguage: string | undefined,
  ): Promise<void> {
    await this.authService.signUp(body, resolveLocale(acceptLanguage));
  }

  @ApiOperation({
    summary: "Entrar na conta",
    description: "Autentica o usuário com e-mail e senha, cria uma sessão e retorna o token de acesso.",
  })
  @Post("sign-in")
  @AllowAnonymous()
  @ApiValidationResponse()
  @ApiInvalidCredentialResponse()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SuccessResponseDto(DTOs.TokenResponseDto) })
  public async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: DTOs.EmailAndPasswordDto,
    @UserAgent() userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<DTOs.TokenResponseDto> {
    const user = await this.authService.signIn(body);

    const { access, refresh } = await this.sessionService.create({ userId: user.id, ipAddress, userAgent });

    this.setRefreshCookie(refresh, res);

    return { access, expiresIn: SESSION_CONSTANT.ACCESS_EXPIRES_IN_MS };
  }

  @ApiOperation({
    summary: "Renovar token de acesso",
    description: "Renova o token de acesso usando o refresh token armazenado em cookie.",
  })
  @Post("refresh")
  @AllowAnonymous()
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth("refresh-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @ApiOkResponse({ type: SuccessResponseDto(DTOs.TokenResponseDto) })
  public async refresh(
    @Cookie("refresh") refreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DTOs.TokenResponseDto> {
    const { access, refresh } = await this.sessionService.refresh(refreshToken || "");

    this.setRefreshCookie(refresh, res);

    return { access, expiresIn: SESSION_CONSTANT.ACCESS_EXPIRES_IN_MS };
  }

  @ApiOperation({
    summary: "Obter usuário atual",
    description: "Retorna os dados públicos do usuário autenticado.",
  })
  @Get("me")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @ApiOkResponse({ type: SuccessResponseDto(PublicUserResponseDto) })
  public me(@Session() { user }: { user: UserEntity }): PublicUserResponseDto {
    return UserMapper.toPublic(user);
  }

  @ApiOperation({
    summary: "Encerrar sessão",
    description: "Revoga a sessão atual do usuário e limpa o cookie de refresh token.",
  })
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @ApiOkResponse({ type: SuccessResponseDto() })
  public async logout(
    @Res({ passthrough: true }) res: Response,
    @Session() { sessionId }: { sessionId: string },
  ): Promise<void> {
    await this.sessionService.revoke(sessionId);

    this.clearRefreshCookie(res);
  }

  @ApiOperation({
    summary: "Encerrar todas as sessões",
    description: "Revoga todas as sessões do usuário autenticado e limpa o cookie de refresh token.",
  })
  @Post("logout-all")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @ApiOkResponse({ type: SuccessResponseDto() })
  public async logoutAll(
    @Res({ passthrough: true }) res: Response,
    @Session() { user }: { user: UserEntity },
  ): Promise<void> {
    await this.sessionService.revokeAll(user.id);

    this.clearRefreshCookie(res);
  }

  private setRefreshCookie(refresh: string, res: Response): void {
    res.cookie("refresh", refresh, {
      maxAge: SESSION_CONSTANT.SESSION_EXPIRES_IN_MS,
      secure: env.NODE_ENV === "production",
      path: "/api/auth/refresh",
      sameSite: "lax",
      httpOnly: true,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie("refresh", {
      secure: env.NODE_ENV === "production",
      path: "/api/auth/refresh",
      sameSite: "lax",
      httpOnly: true,
    });
  }
}
