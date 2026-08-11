import type { InterfaceTheme } from "@/features/theme/theme.type";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends InterfaceTheme {}
}
