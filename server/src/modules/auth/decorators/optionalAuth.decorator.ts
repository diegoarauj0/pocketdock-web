import { applyDecorators, SetMetadata } from "@nestjs/common";

export const IS_OPTIONAL_AUTH = "IS_OPTIONAL_AUTH";

export const OptionalAuths = () => {
  return applyDecorators(SetMetadata(IS_OPTIONAL_AUTH, true));
};
