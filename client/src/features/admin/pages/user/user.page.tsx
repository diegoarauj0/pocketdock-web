import { AdminActionButtonComponent } from "@/features/admin/components/adminActionButton/adminActionButton.component";
import { AdminEmptyStateComponent } from "@/features/admin/components/adminEmptyState/adminEmptyState.component";
import { AdminErrorStateComponent } from "@/features/admin/components/adminErrorState/adminErrorState.component";
import { AdminInstanceCardComponent } from "@/features/admin/components/adminInstanceCard/adminInstanceCard.component";
import { AdminLoadingStateComponent } from "@/features/admin/components/adminLoadingState/adminLoadingState.component";
import { AdminPaginationComponent } from "@/features/admin/components/adminPagination/adminPagination.component";
import { AdminSessionItemComponent } from "@/features/admin/components/adminSessionItem/adminSessionItem.component";
import { AdminBadgeComponent } from "@/features/admin/components/adminBadge/adminBadge.component";
import { useAdminInstanceActions } from "@/features/admin/hooks/useAdminInstanceActions.hook";
import { useAdminUserActions } from "@/features/admin/hooks/useAdminUserActions.hook";
import { useAdminInstancesQuery } from "@/features/admin/queries/useAdminInstances.query";
import { useAdminSessionsQuery } from "@/features/admin/queries/useAdminSessions.query";
import { useAdminUserQuery } from "@/features/admin/queries/useAdminUser.query";
import { ADMIN_CONSTANT } from "@/features/admin/admin.constant";
import { formatDateTime } from "@/shared/utils/formatDate.util";
import { ArrowLeft, Ban, Container, KeyRound, ShieldMinus, ShieldPlus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { APP_PATH } from "@/app/app.path";
import { useState } from "react";
import * as S from "./user.styled";

export function AdminUserPage() {
  const { t } = useTranslation("admin");
  const { id } = useParams<{ id: string }>();
  const [instancesPage, setInstancesPage] = useState(0);
  const [sessionsPage, setSessionsPage] = useState(0);

  const userQuery = useAdminUserQuery(id);
  const instancesQuery = useAdminInstancesQuery(instancesPage, id, ADMIN_CONSTANT.DETAIL_PAGE_SIZE);
  const sessionsQuery = useAdminSessionsQuery(sessionsPage, id, ADMIN_CONSTANT.DETAIL_PAGE_SIZE);

  const {
    confirmDialog: userConfirmDialog,
    handleDeleteUser,
    handleDemote,
    handlePromote,
    handleRevokeAllUserSessions,
    handleRevokeSession,
    isDeleteUserPending,
    isDemoteUserPending,
    isPromoteUserPending,
    isRevokeAllUserSessionsPending,
    isUserActionPending,
    revokingSessionId,
  } = useAdminUserActions({ userQuery });

  const {
    confirmDialog: instanceConfirmDialog,
    deletingInstanceId,
    handleDeleteInstance,
  } = useAdminInstanceActions();

  const renderInstances = () => {
    if (instancesQuery.isLoading) return <AdminLoadingStateComponent />;

    if (instancesQuery.isError || instancesQuery.data === undefined) {
      return (
        <AdminErrorStateComponent
          title={t("ERROR_TITLE")}
          message={t("LOAD_USER_INSTANCES_ERROR")}
          retryLabel={t("RETRY")}
          onRetry={() => void instancesQuery.refetch()}
        />
      );
    }

    if (instancesQuery.data.items.length === 0) {
      return (
        <AdminEmptyStateComponent
          icon={<Container size={22} />}
          title={t("USER_INSTANCES_EMPTY_TITLE")}
          description={t("USER_INSTANCES_EMPTY_DESCRIPTION")}
        />
      );
    }

    return (
      <>
        <S.CardsGrid>
          {instancesQuery.data.items.map((instance) => (
            <AdminInstanceCardComponent
              key={instance.id}
              instance={instance}
              showOwner={false}
              onDelete={handleDeleteInstance}
              isDeleting={deletingInstanceId === instance.id}
            />
          ))}
        </S.CardsGrid>

        <AdminPaginationComponent
          page={instancesPage}
          limit={instancesQuery.data.limit}
          total={instancesQuery.data.total}
          isFetching={instancesQuery.isFetching}
          onPageChange={setInstancesPage}
        />
      </>
    );
  };

  const renderSessions = () => {
    if (sessionsQuery.isLoading) return <AdminLoadingStateComponent />;

    if (sessionsQuery.isError || sessionsQuery.data === undefined) {
      return (
        <AdminErrorStateComponent
          title={t("ERROR_TITLE")}
          message={t("LOAD_USER_SESSIONS_ERROR")}
          retryLabel={t("RETRY")}
          onRetry={() => void sessionsQuery.refetch()}
        />
      );
    }

    if (sessionsQuery.data.items.length === 0) {
      return (
        <AdminEmptyStateComponent
          icon={<KeyRound size={22} />}
          title={t("USER_SESSIONS_EMPTY_TITLE")}
          description={t("USER_SESSIONS_EMPTY_DESCRIPTION")}
        />
      );
    }

    return (
      <>
        <S.SessionsList>
          {sessionsQuery.data.items.map((session) => (
            <AdminSessionItemComponent
              key={session.id}
              session={session}
              onRevoke={handleRevokeSession}
              isRevoking={revokingSessionId === session.id}
            />
          ))}
        </S.SessionsList>

        <AdminPaginationComponent
          page={sessionsPage}
          limit={sessionsQuery.data.limit}
          total={sessionsQuery.data.total}
          isFetching={sessionsQuery.isFetching}
          onPageChange={setSessionsPage}
        />
      </>
    );
  };

  const renderContent = () => {
    if (userQuery.isLoading) return <AdminLoadingStateComponent />;

    if (userQuery.isError || userQuery.data === undefined) {
      return (
        <AdminErrorStateComponent
          title={t("ERROR_TITLE")}
          message={t("LOAD_USER_ERROR")}
          retryLabel={t("RETRY")}
          onRetry={() => void userQuery.refetch()}
        />
      );
    }

    const user = userQuery.data;

    return (
      <>
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
                  onClick={handleDemote}
                >
                  {t("USER_DEMOTE")}
                </AdminActionButtonComponent>
              ) : (
                <AdminActionButtonComponent
                  variant="default"
                  isLoading={isPromoteUserPending}
                  disabled={isUserActionPending}
                  icon={<ShieldPlus size={16} />}
                  onClick={handlePromote}
                >
                  {t("USER_PROMOTE")}
                </AdminActionButtonComponent>
              )}

              <AdminActionButtonComponent
                variant="ghostDanger"
                isLoading={isDeleteUserPending}
                disabled={isUserActionPending}
                icon={<Trash2 size={16} />}
                onClick={handleDeleteUser}
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

        <S.Section>
          <S.SectionHeader>
            <S.SectionHeading>
              <S.SectionTitle>{t("USER_INSTANCES_TITLE")}</S.SectionTitle>
              <S.SectionDescription>{t("USER_INSTANCES_DESCRIPTION")}</S.SectionDescription>
            </S.SectionHeading>

            {instancesQuery.data !== undefined && (
              <S.SectionCount>
                {t("USER_INSTANCES_COUNT", { count: instancesQuery.data.total })}
              </S.SectionCount>
            )}
          </S.SectionHeader>

          {renderInstances()}
        </S.Section>

        <S.Section>
          <S.SectionHeader>
            <S.SectionHeading>
              <S.SectionTitle>{t("USER_SESSIONS_TITLE")}</S.SectionTitle>
              <S.SectionDescription>{t("USER_SESSIONS_DESCRIPTION")}</S.SectionDescription>
            </S.SectionHeading>

            <S.SectionHeaderActions>
              {sessionsQuery.data !== undefined && (
                <S.SectionCount>
                  {t("USER_SESSIONS_COUNT", { count: sessionsQuery.data.total })}
                </S.SectionCount>
              )}

              <AdminActionButtonComponent
                variant="ghostDanger"
                isLoading={isRevokeAllUserSessionsPending}
                disabled={isUserActionPending}
                icon={<Ban size={16} />}
                onClick={handleRevokeAllUserSessions}
              >
                {t("SESSION_REVOKE_ALL")}
              </AdminActionButtonComponent>
            </S.SectionHeaderActions>
          </S.SectionHeader>

          {renderSessions()}
        </S.Section>
      </>
    );
  };

  return (
    <>
      <S.BackRow>
        <S.BackLink to={APP_PATH.ADMIN.USERS}>
          <ArrowLeft size={16} />
          {t("BACK_TO_USERS")}
        </S.BackLink>
      </S.BackRow>

      {renderContent()}

      {userConfirmDialog}
      {instanceConfirmDialog}
    </>
  );
}
