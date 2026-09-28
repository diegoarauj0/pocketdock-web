import * as S from "./featureList.styled";
import type { PropsWithChildren } from "react";

export function FeatureListComponent({ children }: PropsWithChildren) {
  return <S.FeatureList>{children}</S.FeatureList>;
}
