import { applyDecorators, SetMetadata } from "@nestjs/common";

export const IS_ALLOW_ANONYMOUS = "IS_ALLOW_ANONYMOUS";

export const AllowAnonymous = () => {
  return applyDecorators(SetMetadata(IS_ALLOW_ANONYMOUS, true));
};
