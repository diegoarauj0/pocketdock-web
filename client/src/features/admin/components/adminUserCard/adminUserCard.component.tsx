import { AdminActionButtonComponent } from "@/features/admin/components/adminActionButton/adminActionButton.component";
import { AdminBadgeComponent } from "@/features/admin/components/adminBadge/adminBadge.component";
import { formatDateTime } from "@/shared/utils/formatDate.util";
import { ShieldMinus, ShieldPlus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { InterfaceAdminUser } from "../../services/admin.service";
import * as S from "./adminUserCard.styled";

interface InterfaceAdminUserCardProps {
  user: InterfaceAdminUser;
  isDeleteUserPending: boolean;
  isDemoteUserPending: boolean;
  isPromoteUserPending: boolean;
  isUserActionPending: boolean;
  onPromote: () => void;
  onDemote: () => void;
  onDelete: () => void;
}

export function AdminUserCardComponent(props: InterfaceAdminUserCardProps) {
  const {
    user,
    isDeleteUserPending,
    isDemoteUserPending,
    isPromoteUserPending,
    isUserActionPending,
    onPromote,
    onDemote,
    onDelete,
  } = props;

  const { t } = useTranslation("admin");

  return (
    <S.UserCard>
      <S.UserMain>
        <S.Avatar>{user.username.slice(0, 1).toUpperCase() || "?"}</S.Avatar>

        <S.UserInfo>
          <S.Username>{user.username}</S.Username>
          <S.Email>{user.email}</S.Email>
        </S.UserInfo>

        <S.Badges>
          {user.isAdmin && <AdminBadgeComponent tone="primary">{t("USER_ADMIN")}</AdminBadgeComponent>}

          <AdminBadgeComponent tone={user.emailVerified ? "success" : "warning"}>
            {user.emailVerified ? t("USER_EMAIL_VERIFIED") : t("USER_EMAIL_PENDING")}
          </AdminBadgeComponent>
        </S.Badges>

        <S.RoleActions>
          {user.isAdmin ? (
            <AdminActionButtonComponent
              variant="danger"
              isLoading={isDemoteUserPending}
              disabled={isUserActionPending}
              icon={<ShieldMinus size={16} />}
              onClick={onDemote}
            >
              {t("USER_DEMOTE")}
            </AdminActionButtonComponent>
          ) : (
            <AdminActionButtonComponent
              variant="default"
              isLoading={isPromoteUserPending}
              disabled={isUserActionPending}
              icon={<ShieldPlus size={16} />}
              onClick={onPromote}
            >
              {t("USER_PROMOTE")}
            </AdminActionButtonComponent>
          )}

          <AdminActionButtonComponent
            variant="ghostDanger"
            isLoading={isDeleteUserPending}
            disabled={isUserActionPending}
            icon={<Trash2 size={16} />}
            onClick={onDelete}
          >
            {t("USER_DELETE")}
          </AdminActionButtonComponent>
        </S.RoleActions>
      </S.UserMain>

      <S.MetaGrid>
        <S.MetaItem>
          <S.MetaLabel>{t("USER_ID")}</S.MetaLabel>
          <S.MetaValue>{user.id}</S.MetaValue>
        </S.MetaItem>

        <S.MetaItem>
          <S.MetaLabel>{t("USER_CREATED_AT_LABEL")}</S.MetaLabel>
          <S.MetaValue>{formatDateTime(user.createdAt)}</S.MetaValue>
        </S.MetaItem>

        <S.MetaItem>
          <S.MetaLabel>{t("USER_UPDATED_AT")}</S.MetaLabel>
          <S.MetaValue>{formatDateTime(user.updatedAt)}</S.MetaValue>
        </S.MetaItem>
      </S.MetaGrid>
    </S.UserCard>
  );
}
