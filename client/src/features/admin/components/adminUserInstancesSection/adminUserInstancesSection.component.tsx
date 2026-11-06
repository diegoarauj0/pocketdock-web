import { AdminEmptyStateComponent } from "../adminEmptyState/adminEmptyState.component";
import { AdminErrorStateComponent } from "../adminErrorState/adminErrorState.component";
import { AdminInstanceCardComponent } from "../adminInstanceCard/adminInstanceCard.component";
import { AdminLoadingStateComponent } from "../adminLoadingState/adminLoadingState.component";
import { AdminPaginationComponent } from "../adminPagination/adminPagination.component";
import type { InterfaceAdminInstance, InterfaceAdminPaginatedResponse } from "../../services/admin.service";
import { useTranslation } from "react-i18next";
import { Container } from "lucide-react";
import * as Section from "../adminUserSection/adminUserSection.styled";
import * as S from "./adminUserInstancesSection.styled";

export interface InterfaceAdminUserInstancesSectionProps {
  data: InterfaceAdminPaginatedResponse<InterfaceAdminInstance> | undefined;
  onDeleteInstance: (instance: InterfaceAdminInstance) => void;
  onPageChange: (page: number) => void;
  deletingInstanceId?: string;
  onRetry: () => void;
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  page: number;
}

export function AdminUserInstancesSectionComponent(props: InterfaceAdminUserInstancesSectionProps) {
  const { data, isLoading, isError, isFetching, onRetry, page, onPageChange, onDeleteInstance, deletingInstanceId } =
    props;

  const { t } = useTranslation("admin");

  return (
    <Section.Section>
      <Section.SectionHeader>
        <Section.SectionHeading>
          <Section.SectionTitle>{t("USER_INSTANCES_TITLE")}</Section.SectionTitle>
          <Section.SectionDescription>{t("USER_INSTANCES_DESCRIPTION")}</Section.SectionDescription>
        </Section.SectionHeading>

        {data !== undefined && (
          <Section.SectionCount>{t("USER_INSTANCES_COUNT", { count: data.total })}</Section.SectionCount>
        )}
      </Section.SectionHeader>

      {isLoading ? (
        <AdminLoadingStateComponent />
      ) : isError || data === undefined ? (
        <AdminErrorStateComponent
          title={t("ERROR_TITLE")}
          message={t("LOAD_USER_INSTANCES_ERROR")}
          retryLabel={t("RETRY")}
          onRetry={onRetry}
        />
      ) : data.items.length === 0 ? (
        <AdminEmptyStateComponent
          icon={<Container size={22} />}
          title={t("USER_INSTANCES_EMPTY_TITLE")}
          description={t("USER_INSTANCES_EMPTY_DESCRIPTION")}
        />
      ) : (
        <>
          <S.CardsGrid>
            {data.items.map((instance) => (
              <AdminInstanceCardComponent
                key={instance.id}
                instance={instance}
                showOwner={false}
                onDelete={onDeleteInstance}
                isDeleting={deletingInstanceId === instance.id}
              />
            ))}
          </S.CardsGrid>

          <AdminPaginationComponent
            page={page}
            limit={data.limit}
            total={data.total}
            itemsCount={data.items.length}
            isFetching={isFetching}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Section.Section>
  );
}
