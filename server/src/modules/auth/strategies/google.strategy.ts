import { OAuthStrategyErrorReason, OAuthStrategyException } from "../exceptions/OAuthStrategy.exception";
import { InterfaceBaseOAuthStrategy, OAuthStrategyID } from "./base.strategy";
import { Logger } from "@nestjs/common";
import { env } from "src/config/env";
import axios from "axios";

interface InterfaceGoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  id_token: string;
  scope: string;
}

interface InterfaceGoogleUserInfoResponse {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export class GoogleOAuthStrategy implements InterfaceBaseOAuthStrategy {
  private readonly logger = new Logger(GoogleOAuthStrategy.name);

  private readonly GOOGLE_AUTHORIZATION_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
  private readonly GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";
  private readonly GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

  private readonly credentials = {
    clientID: env.GOOGLE_OAUTH_CLIENT_ID,
    redirectUri: env.GOOGLE_OAUTH_REDIRECT_URI,
    clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
  };

  public readonly OAuthStrategyID = OAuthStrategyID.GOOGLE;

  public createAuthorizeURL(state: string): string {
    const url = new URL(this.GOOGLE_AUTHORIZATION_ENDPOINT);

    const params = {
      redirect_uri: this.credentials.redirectUri,
      client_id: this.credentials.clientID,
      scope: "openid email profile",
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      state: state,
    };

    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value || ""));

    this.logger.debug(`Creating Google authorization URL (state=${state})`);

    return url.toString();
  }

  public async callback(code: string): Promise<{ email: string; username: string; id: string }> {
    this.logger.debug("Requesting access token from Google");
    const { access_token } = await this.requestTokenByCode(code);

    this.logger.debug("Fetching Google user information");
    const userInfo = await this.fetchUserInfo(access_token);

    this.logger.debug(`Google user retrieved (id=${userInfo.sub})`);

    return {
      id: userInfo.sub,
      email: userInfo.email,
      username: userInfo.name,
    };
  }

  private async requestTokenByCode(code: string): Promise<InterfaceGoogleTokenResponse> {
    try {
      const response = await axios.post<InterfaceGoogleTokenResponse>(this.GOOGLE_TOKEN_ENDPOINT, {
        client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI,
        client_id: env.GOOGLE_OAUTH_CLIENT_ID,
        grant_type: "authorization_code",
        code: code,
      });

      if (!response.data || typeof response.data.access_token !== "string") {
        throw new OAuthStrategyException(this.OAuthStrategyID, OAuthStrategyErrorReason.INVALID_PROVIDER_RESPONSE);
      }

      return response.data;
    } catch (error) {
      this.logger.error("Failed to communicate with OAuth provider", error);
      throw new OAuthStrategyException(this.OAuthStrategyID, OAuthStrategyErrorReason.TOKEN_EXCHANGE_FAILED);
    }
  }

  private async fetchUserInfo(accessToken: string): Promise<InterfaceGoogleUserInfoResponse> {
    try {
      const response = await axios.get<InterfaceGoogleUserInfoResponse>(this.GOOGLE_USERINFO_ENDPOINT, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.data || typeof response.data.sub !== "string" || typeof response.data.email !== "string") {
        throw new OAuthStrategyException(this.OAuthStrategyID, OAuthStrategyErrorReason.INVALID_PROVIDER_RESPONSE);
      }

      if (response.data.email_verified === false) {
        throw new OAuthStrategyException(this.OAuthStrategyID, OAuthStrategyErrorReason.UNVERIFIED_EMAIL);
      }

      return response.data;
    } catch (error) {
      this.logger.error("Failed to communicate with OAuth provider", error);
      throw new OAuthStrategyException(this.OAuthStrategyID, OAuthStrategyErrorReason.USER_INFO_FETCH_FAILED);
    }
  }
}
