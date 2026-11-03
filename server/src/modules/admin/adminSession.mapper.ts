import { AdminSessionResponseDto } from "./dtos/adminSession.dto";
import { SessionEntity } from "src/modules/sessions/session.entity";
import { truncateIpAddress } from "./helpers/truncateIpAddress.helper";
import { truncateUserAgent } from "./helpers/truncateUserAgent.helper";
import { maskEmail } from "./helpers/maskEmail.helper";

export class AdminSessionMapper {
  public static toResponse(session: SessionEntity): AdminSessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      user: {
        id: session.user.id,
        username: session.user.username,
        email: maskEmail(session.user.email),
      },
      expiresAt: session.expiresAt,
      revoked: session.revoked,
      revokedAt: session.revokedAt,
      revokeType: session.revokeType,
      ipAddress: truncateIpAddress(session.ipAddress),
      userAgent: truncateUserAgent(session.userAgent),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
