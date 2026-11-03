import { IS_ADMIN_ONLY } from "../decorators/adminOnly.decorator";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/modules/users/user.entity";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const isAdminOnly = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_ONLY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isAdminOnly !== true) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: UserEntity }>();

    if (request.user?.isAdmin !== true) {
      throw new ForbiddenException();
    }

    return true;
  }
}
