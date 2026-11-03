import { INSTANCE_STATUS_LABEL_KEYS } from "@/features/instances/utils/instanceStatus.util";
import { formatDateTime } from "@/shared/utils/formatDate.util";
import { APP_PATH } from "@/app/app.path";
import { useTranslation } from "react-i18next";
import { Container, ExternalLink, UserRound } from "lucide-react";
import { AdminBadgeComponent, type AdminBadgeTone } from "../adminBadge/adminBadge.component";
import type { InterfaceAdminInstance } from "../../services/admin.service";
import * as S from "./adminInstanceCard.styled";

interface InterfaceAdminInstanceCardProps {
  instance: InterfaceAdminInstance;
  showOwner?: boolean;
}

const STATUS_TONE_MAP = {
  pending: "warning",
  completed: "success",
  failed: "danger",
} as const satisfies Record<InterfaceAdminInstance["status"], AdminBadgeTone>;

export function AdminInstanceCardComponent({ instance, showOwner = true }: InterfaceAdminInstanceCardProps) {
  const { t } = useTranslation(["admin", "instances"]);

  return (
    <S.Card>
      <S.Header>
        <S.IconArea $status={instance.status}>
          <Container size={20} />
        </S.IconArea>

        <AdminBadgeComponent tone={STATUS_TONE_MAP[instance.status]}>
          {t(INSTANCE_STATUS_LABEL_KEYS[instance.status], { ns: "instances" })}
        </AdminBadgeComponent>
      </S.Header>

      <S.Name title={instance.containerName}>{instance.containerName}</S.Name>
      <S.Id>{instance.id}</S.Id>

      {showOwner && (
        <S.OwnerLink to={`${APP_PATH.ADMIN.USERS}/${instance.user.id}`}>
          <UserRound size={14} />
          <span>{instance.user.username}</span>
          <S.OwnerEmail>{instance.user.email}</S.OwnerEmail>
        </S.OwnerLink>
      )}

      {instance.url.length > 0 ? (
        <S.UrlLink href={instance.url} target="_blank" rel="noreferrer">
          <ExternalLink size={14} />
          {instance.url}
        </S.UrlLink>
      ) : (
        <S.UrlPlaceholder>{t("INSTANCE_URL_PENDING")}</S.UrlPlaceholder>
      )}

      <S.Meta>
        <S.MetaLabel>{t("INSTANCE_CREATED_AT")}</S.MetaLabel>
        <S.MetaValue>{formatDateTime(instance.createdAt)}</S.MetaValue>
      </S.Meta>
    </S.Card>
  );
}
