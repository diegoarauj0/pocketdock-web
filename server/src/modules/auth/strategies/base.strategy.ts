export enum OAuthStrategyID {
  GOOGLE = "GOOGLE",
}

export interface InterfaceBaseOAuthStrategy {
  OAuthStrategyID: OAuthStrategyID;

  createAuthorizeURL(state: string): string;

  callback(code: string): Promise<{ email: string; username: string; id: string }>;
}
