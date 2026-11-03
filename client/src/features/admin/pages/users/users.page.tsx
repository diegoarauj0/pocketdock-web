import { AdminEmptyStateComponent } from "@/features/admin/components/adminEmptyState/adminEmptyState.component";
import { AdminErrorStateComponent } from "@/features/admin/components/adminErrorState/adminErrorState.component";
import { AdminLoadingStateComponent } from "@/features/admin/components/adminLoadingState/adminLoadingState.component";
import { AdminPaginationComponent } from "@/features/admin/components/adminPagination/adminPagination.component";
import { AdminBadgeComponent } from "@/features/admin/components/adminBadge/adminBadge.component";
import { useAdminUsersQuery } from "@/features/admin/queries/useAdminUsers.query";
import { formatDateTime } from "@/shared/utils/formatDate.util";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { APP_PATH } from "@/app/app.path";
import { ChevronRight, Users } from "lucide-react";
import * as S from "./users.styled";

export function AdminUsersPage() {
  const { t } = useTranslation("admin");
  const [page, setPage] = useState(0);
  const { data, isError, isFetching, isLoading, refetch } = useAdminUsersQuery(page);

  if (isLoading) return <AdminLoadingStateComponent />;

  if (isError || data === undefined) {
    return (
      <AdminErrorStateComponent
        title={t("ERROR_TITLE")}
        message={t("LOAD_USERS_ERROR")}
        retryLabel={t("RETRY")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <>
      <S.SectionHeader>
        <S.SectionTitle>{t("USERS_TITLE")}</S.SectionTitle>
        <S.SectionDescription>{t("USERS_DESCRIPTION", { count: data.total })}</S.SectionDescription>
      </S.SectionHeader>

      {data.items.length === 0 ? (
        <AdminEmptyStateComponent
          icon={<Users size={22} />}
          title={t("USERS_EMPTY_TITLE")}
          description={t("USERS_EMPTY_DESCRIPTION")}
        />
      ) : (
        <S.List>
          {data.items.map((user) => (
            <S.UserRow key={user.id} to={`${APP_PATH.ADMIN.USERS}/${user.id}`}>
              <S.UserIdentity>
                <S.Avatar>{user.username.slice(0, 1).toUpperCase() || "?"}</S.Avatar>

                <S.IdentityText>
                  <S.Username title={user.username}>{user.username}</S.Username>
                  <S.Email>{user.email}</S.Email>
                </S.IdentityText>
              </S.UserIdentity>

              <S.Badges>
                {user.isAdmin && <AdminBadgeComponent tone="primary">{t("USER_ADMIN")}</AdminBadgeComponent>}

                <AdminBadgeComponent tone={user.emailVerified ? "success" : "warning"}>
                  {user.emailVerified ? t("USER_EMAIL_VERIFIED") : t("USER_EMAIL_PENDING")}
                </AdminBadgeComponent>
              </S.Badges>

              <S.CreatedAt>{t("USER_CREATED_AT", { date: formatDateTime(user.createdAt) })}</S.CreatedAt>

              <S.Chevron>
                <ChevronRight size={16} />
              </S.Chevron>
            </S.UserRow>
          ))}
        </S.List>
      )}

      <AdminPaginationComponent
        page={page}
        limit={data.limit}
        total={data.total}
        isFetching={isFetching}
        onPageChange={setPage}
      />
    </>
  );
}
