import { InterfaceBaseOAuthStrategy, OAuthStrategyID } from "./strategies/base.strategy";
import { GoogleOAuthStrategy } from "./strategies/google.strategy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OAuthStrategyRegistry {
  constructor(private readonly googleOAuthStrategy: GoogleOAuthStrategy) {}

  public get strategies(): Record<OAuthStrategyID, InterfaceBaseOAuthStrategy> {
    const OAuthStrategiesMap: Record<OAuthStrategyID, InterfaceBaseOAuthStrategy> = {
      [OAuthStrategyID.GOOGLE]: this.googleOAuthStrategy,
    };

    return OAuthStrategiesMap;
  }
}
