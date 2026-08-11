import { ApiCreatedResponse, ApiFoundResponse, ApiOperation } from "@nestjs/swagger";
import { ApiInvalidOAuthStateResponse } from "src/common/decorators/swagger/invalidOAuthState.decorator";
import { ApiOAuthEmailConflictResponse } from "src/common/decorators/swagger/oAuthEmailConflict.decorator";
import { ApiOAuthStrategyErrorResponse } from "src/common/decorators/swagger/oAuthStrategy.decorator";
import { ApiValidationResponse } from "src/common/decorators/swagger/validation.decorator";
import { StrategyIDParamsDto, CallbackQueriesDto, AuthorizeResponseDto } from "../dtos/OAuth.dto";
import { SessionService } from "src/modules/session/services/session.service";
import { Controller, Get, Ip, Param, Post, Query, Res } from "@nestjs/common";
import { AllowAnonymous } from "../decorators/allowAnonymous.decorator";
import { SESSION_CONSTANT } from "src/modules/session/session.constant";
import { UserAgent } from "src/common/decorators/userAgent.decorator";
import { Cookie } from "src/common/decorators/cookie.decorator";
import { OAuthService } from "../services/OAuth.service";
import { AUTH_CONSTANT } from "../auth.constant";
import type { Response } from "express";
import { env } from "src/config/env";
import { SuccessResponseDto } from "src/common/dtos/successResponse.dto";

@Controller("api/oauth")
export class OAuthController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly OAuthService: OAuthService,
  ) {}

  @ApiOperation({
    summary: "Callback da estratégia OAuth",
    description:
      "Recebe o código de autorização do provedor OAuth, valida o estado, cria a sessão e redireciona para a URL de sucesso.",
  })
  @ApiFoundResponse({ description: "Redireciona para a URL de sucesso com a sessão criada." })
  @AllowAnonymous()
  @ApiValidationResponse()
  @ApiInvalidOAuthStateResponse()
  @ApiOAuthEmailConflictResponse()
  @ApiOAuthStrategyErrorResponse()
  @Get("callback/:strategyID")
  public async callback(
    @Res({ passthrough: false }) res: Response,
    @Param() params: StrategyIDParamsDto,
    @Query() queries: CallbackQueriesDto,
    @Cookie("state") stateCookie: string,
    @UserAgent() userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<void> {
    const { code, state } = queries;
    const { strategyID } = params;

    this.OAuthService.validateState(state, stateCookie);

    const user = await this.OAuthService.callback(strategyID, code);

    const { refresh } = await this.sessionService.create({
      userID: user.ID,
      ipAddress,
      userAgent,
    });

    res.clearCookie("state", { path: `/api/oauth/callback/${strategyID}` }).cookie("refresh", refresh, {
      maxAge: SESSION_CONSTANT.SESSION_EXPIRES_IN_MS,
      secure: env.NODE_ENV === "production",
      path: "/api/auth/refresh",
      sameSite: "lax",
      httpOnly: true,
    });

    const successURL = new URL(env.OAUTH_SUCCESS_REDIRECT_URL);

    successURL.searchParams.set(
      AUTH_CONSTANT.OAUTH_SUCCESS_REDIRECT_QUERY_KEY,
      AUTH_CONSTANT.OAUTH_SUCCESS_REDIRECT_QUERY_VALUE,
    );

    res.redirect(successURL.toString());
  }

  @ApiOperation({
    summary: "Criar URL de autorização",
    description: "Gera a URL de autorização da estratégia OAuth e armazena o estado de verificação em cookie.",
  })
  @ApiCreatedResponse({
    description: "URL de autorização gerada com sucesso.",
    type: SuccessResponseDto(AuthorizeResponseDto),
  })
  @AllowAnonymous()
  @ApiValidationResponse()
  @Post("authorize/:strategyID")
  public createAuthorizeURL(
    @Param() { strategyID }: StrategyIDParamsDto,
    @Res({ passthrough: true }) res: Response,
  ): AuthorizeResponseDto {
    const { authorizeURL, state } = this.OAuthService.createAuthorizeURL(strategyID);

    res.cookie("state", state, {
      maxAge: AUTH_CONSTANT.OAUTH_STATE_EXPIRES_IN_MS,
      path: `/api/oauth/callback/${strategyID}`,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    });

    return { authorizeURL: authorizeURL, strategyID: strategyID };
  }
}
