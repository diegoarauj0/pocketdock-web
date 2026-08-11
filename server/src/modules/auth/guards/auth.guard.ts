import { InvalidTokenException, InvalidTokenReason } from "src/modules/session/exceptions/invalidToken.exception";
import { SessionService } from "src/modules/session/services/session.service";
import { IS_ALLOW_ANONYMOUS } from "../decorators/allowAnonymous.decorator";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IS_OPTIONAL_AUTHS } from "../decorators/optionalAuth.decorator";
import { UserEntity } from "src/modules/users/user.entity";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & {
        sessionID: string;
        user: UserEntity;
      }
    >();

    const isAllowAnonymous = this.reflector.getAllAndOverride<boolean | undefined>(IS_ALLOW_ANONYMOUS, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isOptionalAuths = this.reflector.getAllAndOverride<boolean | undefined>(IS_OPTIONAL_AUTHS, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isAllowAnonymous === true) return true;

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      if (isOptionalAuths) return true;

      throw new InvalidTokenException("access", InvalidTokenReason.REQUIRED);
    }

    const token = authorization.replace("Bearer ", "");

    if (token === "") {
      if (isOptionalAuths) return true;

      throw new InvalidTokenException("access", InvalidTokenReason.REQUIRED);
    }

    const { sessionID, user } = await this.sessionService.verifyAccessToken(token);

    request.sessionID = sessionID;
    request.user = user;

    return true;
  }
}
