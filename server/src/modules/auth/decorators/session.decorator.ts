import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { UserEntity } from "src/modules/users/user.entity";

export const Session = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { sessionID: string; user: UserEntity }>();

  return { user: request.user, sessionID: request.sessionID };
});
