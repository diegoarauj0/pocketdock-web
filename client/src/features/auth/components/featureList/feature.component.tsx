import { ShieldCheck } from "lucide-react";
import * as S from "./featureList.styled";

interface InterfaceFeatureProps {
  feature: string;
}

export function FeatureComponent({ feature }: InterfaceFeatureProps) {
  return (
    <S.Feature>
      <ShieldCheck aria-hidden="true" />
      <span>{feature}</span>
    </S.Feature>
  );
}
