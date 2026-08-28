import { InvalidTokenException, InvalidTokenReason } from "../exceptions/invalidToken.exception";
import JWT, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { SESSION_CONSTANT } from "../session.constant";
import { Injectable } from "@nestjs/common";
import { env } from "src/config/env";

interface InterfaceCreateAccessTokenProps {
  sessionID: string;
  userID: string;
}

interface InterfaceCreateRefreshTokenProps {
  sessionID: string;
  userID: string;
}

@Injectable()
export class JWTService {
  public createAccessToken(props: InterfaceCreateAccessTokenProps): string {
    const { sessionID, userID } = props;

    return JWT.sign({ sessionID, userID, type: "access" }, env.SECRET, {
      expiresIn: SESSION_CONSTANT.ACCESS_EXPIRES_IN_MS / 1000,
    });
  }

  public createRefreshToken(props: InterfaceCreateRefreshTokenProps): string {
    const { sessionID, userID } = props;

    return JWT.sign({ sessionID, userID, type: "refresh" }, env.SECRET, {
      expiresIn: SESSION_CONSTANT.SESSION_EXPIRES_IN_MS / 1000,
    });
  }

  public verifyRefreshToken(refresh: string): InterfaceCreateRefreshTokenProps {
    try {
      const { sessionID, type, userID } = JWT.verify(refresh, env.SECRET) as {
        sessionID: string;
        userID: string;
        type: string;
      };

      if (type !== "refresh") throw new InvalidTokenException("refresh", InvalidTokenReason.INVALID);

      return { sessionID, userID };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenException("refresh", InvalidTokenReason.INVALID);
      }

      if (error instanceof TokenExpiredError) {
        throw new InvalidTokenException("refresh", InvalidTokenReason.EXPIRED);
      }

      throw error;
    }
  }

  public verifyAccessToken(access: string): InterfaceCreateAccessTokenProps {
    try {
      const { sessionID, type, userID } = JWT.verify(access, env.SECRET) as {
        sessionID: string;
        userID: string;
        type: string;
      };

      if (type !== "access") throw new InvalidTokenException("access", InvalidTokenReason.INVALID);

      return { sessionID, userID };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenException("access", InvalidTokenReason.INVALID);
      }

      if (error instanceof TokenExpiredError) {
        throw new InvalidTokenException("access", InvalidTokenReason.EXPIRED);
      }

      throw error;
    }
  }
}
