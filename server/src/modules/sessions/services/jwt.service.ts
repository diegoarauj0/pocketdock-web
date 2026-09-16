import { InvalidTokenException, InvalidTokenReason } from "../exceptions/invalidToken.exception";
import JWT, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { SESSION_CONSTANT } from "../session.constant";
import { Injectable } from "@nestjs/common";
import { env } from "src/config/env";

interface InterfaceCreateAccessTokenProps {
  sessionId: string;
  userId: string;
}

interface InterfaceCreateRefreshTokenProps {
  sessionId: string;
  userId: string;
}

@Injectable()
export class JWTService {
  public createAccessToken(props: InterfaceCreateAccessTokenProps): string {
    const { sessionId, userId } = props;

    return JWT.sign({ sessionId, userId, type: "access" }, env.SECRET, {
      expiresIn: SESSION_CONSTANT.ACCESS_EXPIRES_IN_MS / 1000,
    });
  }

  public createRefreshToken(props: InterfaceCreateRefreshTokenProps): string {
    const { sessionId, userId } = props;

    return JWT.sign({ sessionId, userId, type: "refresh" }, env.SECRET, {
      expiresIn: SESSION_CONSTANT.SESSION_EXPIRES_IN_MS / 1000,
    });
  }

  public verifyRefreshToken(refresh: string): InterfaceCreateRefreshTokenProps {
    try {
      const { sessionId, type, userId } = JWT.verify(refresh, env.SECRET) as {
        sessionId: string;
        userId: string;
        type: string;
      };

      if (typeof sessionId !== "string" || typeof userId !== "string" || type !== "refresh") {
        throw new InvalidTokenException("refresh", InvalidTokenReason.INVALID);
      }

      return { sessionId: sessionId, userId: userId };
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
      const { sessionId, type, userId } = JWT.verify(access, env.SECRET) as {
        sessionId: string;
        userId: string;
        type: string;
      };

      if (typeof sessionId !== "string" || typeof userId !== "string" || type !== "access") {
        throw new InvalidTokenException("access", InvalidTokenReason.INVALID);
      }

      return { sessionId: sessionId, userId: userId };
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
