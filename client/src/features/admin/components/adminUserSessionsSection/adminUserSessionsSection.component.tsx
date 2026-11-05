import { AdminActionButtonComponent } from "../adminActionButton/adminActionButton.component";
import { AdminEmptyStateComponent } from "../adminEmptyState/adminEmptyState.component";
import { AdminErrorStateComponent } from "../adminErrorState/adminErrorState.component";
import { AdminLoadingStateComponent } from "../adminLoadingState/adminLoadingState.component";
import { AdminPaginationComponent } from "../adminPagination/adminPagination.component";
import { AdminSessionItemComponent } from "../adminSessionItem/adminSessionItem.component";
import type { InterfaceAdminPaginatedResponse, InterfaceAdminSession } from "../../services/admin.service";
import { useTranslation } from "react-i18next";
import { Ban, KeyRound } from "lucide-react";
import * as Section from "../adminUserSection/adminUserSection.styled";
import * as S from "./adminUserSessionsSection.styled";

export interface InterfaceAdminUserSessionsSectionProps {
  data: InterfaceAdminPaginatedResponse<InterfaceAdminSession> | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
  page: number;
  onPageChange: (page: number) => void;
  onRevokeSession: (session: InterfaceAdminSession) => void;
  revokingSessionId?: string;
  onRevokeAllSessions: () => void;
  isRevokeAllSessionsPending: boolean;
  isUserActionPending: boolean;
}

export function AdminUserSessionsSectionComponent(props: InterfaceAdminUserSessionsSectionProps) {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    onRetry,
    page,
    onPageChange,
    onRevokeSession,
    revokingSessionId,
    onRevokeAllSessions,
    isRevokeAllSessionsPending,
    isUserActionPending,
  } = props;

  const { t } = useTranslation("admin");

  return (
    <Section.Section>
      <Section.SectionHeader>
        <Section.SectionHeading>
          <Section.SectionTitle>{t("USER_SESSIONS_TITLE")}</Section.SectionTitle>
          <Section.SectionDescription>{t("USER_SESSIONS_DESCRIPTION")}</Section.SectionDescription>
        </Section.SectionHeading>

        <Section.SectionHeaderActions>
          {data !== undefined && (
            <Section.SectionCount>{t("USER_SESSIONS_COUNT", { count: data.total })}</Section.SectionCount>
          )}

          <AdminActionButtonComponent
            variant="ghostDanger"
            isLoading={isRevokeAllSessionsPending}
            disabled={isUserActionPending}
            icon={<Ban size={16} />}
            onClick={onRevokeAllSessions}
          >
            {t("SESSION_REVOKE_ALL")}
          </AdminActionButtonComponent>
        </Section.SectionHeaderActions>
      </Section.SectionHeader>

      {isLoading ? (
        <AdminLoadingStateComponent />
      ) : isError || data === undefined ? (
        <AdminErrorStateComponent
          title={t("ERROR_TITLE")}
          message={t("LOAD_USER_SESSIONS_ERROR")}
          retryLabel={t("RETRY")}
          onRetry={onRetry}
        />
      ) : data.items.length === 0 ? (
        <AdminEmptyStateComponent
          icon={<KeyRound size={22} />}
          title={t("USER_SESSIONS_EMPTY_TITLE")}
          description={t("USER_SESSIONS_EMPTY_DESCRIPTION")}
        />
      ) : (
        <>
          <S.SessionsList>
            {data.items.map((session) => (
              <AdminSessionItemComponent
                key={session.id}
                session={session}
                onRevoke={onRevokeSession}
                isRevoking={revokingSessionId === session.id}
              />
            ))}
          </S.SessionsList>

          <AdminPaginationComponent
            page={page}
            limit={data.limit}
            total={data.total}
            isFetching={isFetching}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Section.Section>
  );
}
