import { applyDecorators, SetMetadata } from "@nestjs/common";

export const IS_ADMIN_ONLY = "IS_ADMIN_ONLY";

export const AdminOnly = () => {
  return applyDecorators(SetMetadata(IS_ADMIN_ONLY, true));
};
