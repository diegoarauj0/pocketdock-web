import { AdminErrorStateComponent } from "@/features/admin/components/adminErrorState/adminErrorState.component";
import { AdminLoadingStateComponent } from "@/features/admin/components/adminLoadingState/adminLoadingState.component";
import { AdminUserCardComponent } from "@/features/admin/components/adminUserCard/adminUserCard.component";
import { AdminUserInstancesSectionComponent } from "@/features/admin/components/adminUserInstancesSection/adminUserInstancesSection.component";
import { AdminUserSessionsSectionComponent } from "@/features/admin/components/adminUserSessionsSection/adminUserSessionsSection.component";
import { useAdminInstanceActions } from "@/features/admin/hooks/useAdminInstanceActions.hook";
import { useAdminUserActions } from "@/features/admin/hooks/useAdminUserActions.hook";
import { useAdminInstancesQuery } from "@/features/admin/queries/useAdminInstances.query";
import { useAdminSessionsQuery } from "@/features/admin/queries/useAdminSessions.query";
import { useAdminUserQuery } from "@/features/admin/queries/useAdminUser.query";
import { ADMIN_CONSTANT } from "@/features/admin/admin.constant";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
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

  const { confirmDialog: instanceConfirmDialog, deletingInstanceId, handleDeleteInstance } = useAdminInstanceActions();

  return (
    <>
      <S.BackRow>
        <S.BackLink to={APP_PATH.ADMIN.USERS}>
          <ArrowLeft size={16} />
          {t("BACK_TO_USERS")}
        </S.BackLink>
      </S.BackRow>

      {userQuery.isLoading ? (
        <AdminLoadingStateComponent />
      ) : userQuery.isError || userQuery.data === undefined ? (
        <AdminErrorStateComponent
          title={t("ERROR_TITLE")}
          message={t("LOAD_USER_ERROR")}
          retryLabel={t("RETRY")}
          onRetry={() => void userQuery.refetch()}
        />
      ) : (
        <>
          <AdminUserCardComponent
            user={userQuery.data}
            isDeleteUserPending={isDeleteUserPending}
            isDemoteUserPending={isDemoteUserPending}
            isPromoteUserPending={isPromoteUserPending}
            isUserActionPending={isUserActionPending}
            onPromote={handlePromote}
            onDemote={handleDemote}
            onDelete={handleDeleteUser}
          />

          <AdminUserInstancesSectionComponent
            data={instancesQuery.data}
            isLoading={instancesQuery.isLoading}
            isError={instancesQuery.isError}
            isFetching={instancesQuery.isFetching}
            onRetry={() => void instancesQuery.refetch()}
            page={instancesPage}
            onPageChange={setInstancesPage}
            onDeleteInstance={handleDeleteInstance}
            deletingInstanceId={deletingInstanceId}
          />

          <AdminUserSessionsSectionComponent
            data={sessionsQuery.data}
            isLoading={sessionsQuery.isLoading}
            isError={sessionsQuery.isError}
            isFetching={sessionsQuery.isFetching}
            onRetry={() => void sessionsQuery.refetch()}
            page={sessionsPage}
            onPageChange={setSessionsPage}
            onRevokeSession={handleRevokeSession}
            revokingSessionId={revokingSessionId}
            onRevokeAllSessions={handleRevokeAllUserSessions}
            isRevokeAllSessionsPending={isRevokeAllUserSessionsPending}
            isUserActionPending={isUserActionPending}
          />
        </>
      )}

      {userConfirmDialog}
      {instanceConfirmDialog}
    </>
  );
}
