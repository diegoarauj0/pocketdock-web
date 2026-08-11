import { applyDecorators, SetMetadata } from "@nestjs/common";

export const IS_OPTIONAL_AUTHS = "IS_OPTIONAL_AUTHS";

export const OptionalAuths = () => {
  return applyDecorators(SetMetadata(IS_OPTIONAL_AUTHS, true));
};
