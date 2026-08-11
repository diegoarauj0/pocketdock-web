import { FeatureListComponent } from "../featureList/featureList.component";
import { FeatureComponent } from "../featureList/feature.component";
import type { PropsWithChildren, ReactNode } from "react";
import * as S from "./authIntro.styled";

interface InterfaceAuthIntroProps extends PropsWithChildren {
  headline: ReactNode;
  description: string;
  features?: string[];
}

export function AuthIntroComponent({ headline, description, features, children }: InterfaceAuthIntroProps) {
  return (
    <S.IntroPanel>
      <S.IntroContent>
        <S.LeftWrapper>
          <S.Headline>{headline}</S.Headline>
          <S.Description>{description}</S.Description>

          <FeatureListComponent>
            {features?.map((feature) => (
              <FeatureComponent feature={feature} />
            ))}
          </FeatureListComponent>
        </S.LeftWrapper>

        {children}
      </S.IntroContent>
    </S.IntroPanel>
  );
}
