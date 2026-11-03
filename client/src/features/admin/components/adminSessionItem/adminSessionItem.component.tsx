import { formatDateTime } from "@/shared/utils/formatDate.util";
import { useTranslation } from "react-i18next";
import { Ban, CalendarClock, Globe, Info, Monitor } from "lucide-react";
import { AdminBadgeComponent, type AdminBadgeTone } from "../adminBadge/adminBadge.component";
import type { AdminSessionRevokeType, InterfaceAdminSession } from "../../services/admin.service";
import * as S from "./adminSessionItem.styled";

interface InterfaceAdminSessionItemProps {
  session: InterfaceAdminSession;
}

const REVOKE_TYPE_LABEL_KEYS = {
  TOKEN_REUSE: "SESSION_REVOKE_TOKEN_REUSE",
  LOGOUT_ALL: "SESSION_REVOKE_LOGOUT_ALL",
  EXPIRED: "SESSION_REVOKE_EXPIRED",
  LOGOUT: "SESSION_REVOKE_LOGOUT",
} as const satisfies Record<AdminSessionRevokeType, string>;

function resolveSessionStatus(session: InterfaceAdminSession): "active" | "revoked" | "expired" {
  if (session.revoked) return "revoked";

  const isExpired = new Date(session.expiresAt).getTime() < Date.now();

  return isExpired ? "expired" : "active";
}

const STATUS_TONE_MAP = {
  active: "success",
  expired: "warning",
  revoked: "danger",
} as const satisfies Record<"active" | "revoked" | "expired", AdminBadgeTone>;

export function AdminSessionItemComponent({ session }: InterfaceAdminSessionItemProps) {
  const { t } = useTranslation("admin");
  const status = resolveSessionStatus(session);
  const statusLabelKeys = {
    active: "SESSION_STATUS_ACTIVE",
    revoked: "SESSION_STATUS_REVOKED",
    expired: "SESSION_STATUS_EXPIRED",
  } as const;

  return (
    <S.Item>
      <S.Header>
        <AdminBadgeComponent tone={STATUS_TONE_MAP[status]}>{t(statusLabelKeys[status])}</AdminBadgeComponent>
        <S.CreatedAt>{t("SESSION_CREATED_AT", { date: formatDateTime(session.createdAt) })}</S.CreatedAt>
      </S.Header>

      <S.Details>
        <S.Detail>
          <S.DetailIcon>
            <Globe size={14} />
          </S.DetailIcon>
          <S.DetailText>
            <S.DetailLabel>{t("SESSION_IP")}</S.DetailLabel>
            <S.DetailValue>{session.ipAddress ?? t("SESSION_UNKNOWN")}</S.DetailValue>
          </S.DetailText>
        </S.Detail>

        <S.Detail>
          <S.DetailIcon>
            <Monitor size={14} />
          </S.DetailIcon>
          <S.DetailText>
            <S.DetailLabel>{t("SESSION_USER_AGENT")}</S.DetailLabel>
            <S.DetailValue>{session.userAgent ?? t("SESSION_UNKNOWN")}</S.DetailValue>
          </S.DetailText>
        </S.Detail>

        <S.Detail>
          <S.DetailIcon>
            <CalendarClock size={14} />
          </S.DetailIcon>
          <S.DetailText>
            <S.DetailLabel>{t("SESSION_EXPIRES_AT")}</S.DetailLabel>
            <S.DetailValue>{formatDateTime(session.expiresAt)}</S.DetailValue>
          </S.DetailText>
        </S.Detail>

        {session.revokedAt !== null && (
          <S.Detail>
            <S.DetailIcon>
              <Ban size={14} />
            </S.DetailIcon>
            <S.DetailText>
              <S.DetailLabel>{t("SESSION_REVOKED_AT")}</S.DetailLabel>
              <S.DetailValue>{formatDateTime(session.revokedAt)}</S.DetailValue>
            </S.DetailText>
          </S.Detail>
        )}

        {session.revokeType !== null && (
          <S.Detail>
            <S.DetailIcon>
              <Info size={14} />
            </S.DetailIcon>
            <S.DetailText>
              <S.DetailLabel>{t("SESSION_REVOKE_REASON")}</S.DetailLabel>
              <S.DetailValue>{t(REVOKE_TYPE_LABEL_KEYS[session.revokeType])}</S.DetailValue>
            </S.DetailText>
          </S.Detail>
        )}
      </S.Details>

      <S.SessionId>{session.id}</S.SessionId>
    </S.Item>
  );
}
