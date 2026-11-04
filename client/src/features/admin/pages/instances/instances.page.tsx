import { AdminEmptyStateComponent } from "@/features/admin/components/adminEmptyState/adminEmptyState.component";
import { AdminErrorStateComponent } from "@/features/admin/components/adminErrorState/adminErrorState.component";
import { AdminInstanceCardComponent } from "@/features/admin/components/adminInstanceCard/adminInstanceCard.component";
import { AdminLoadingStateComponent } from "@/features/admin/components/adminLoadingState/adminLoadingState.component";
import { AdminPaginationComponent } from "@/features/admin/components/adminPagination/adminPagination.component";
import { useAdminInstanceActions } from "@/features/admin/hooks/useAdminInstanceActions.hook";
import { useAdminInstancesQuery } from "@/features/admin/queries/useAdminInstances.query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Container } from "lucide-react";
import * as S from "./instances.styled";

export function AdminInstancesPage() {
  const { t } = useTranslation("admin");
  const [page, setPage] = useState(0);
  const { data, isError, isFetching, isLoading, refetch } = useAdminInstancesQuery(page);
  const { confirmDialog, deletingInstanceId, handleDeleteInstance } = useAdminInstanceActions();

  if (isLoading) return <AdminLoadingStateComponent />;

  if (isError || data === undefined) {
    return (
      <AdminErrorStateComponent
        title={t("ERROR_TITLE")}
        message={t("LOAD_INSTANCES_ERROR")}
        retryLabel={t("RETRY")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <>
      <S.SectionHeader>
        <S.SectionTitle>{t("INSTANCES_TITLE")}</S.SectionTitle>
        <S.SectionDescription>{t("INSTANCES_DESCRIPTION", { count: data.total })}</S.SectionDescription>
      </S.SectionHeader>

      {data.items.length === 0 ? (
        <AdminEmptyStateComponent
          icon={<Container size={22} />}
          title={t("INSTANCES_EMPTY_TITLE")}
          description={t("INSTANCES_EMPTY_DESCRIPTION")}
        />
      ) : (
        <S.CardsGrid>
          {data.items.map((instance) => (
            <AdminInstanceCardComponent
              key={instance.id}
              instance={instance}
              onDelete={handleDeleteInstance}
              isDeleting={deletingInstanceId === instance.id}
            />
          ))}
        </S.CardsGrid>
      )}

      <AdminPaginationComponent
        page={page}
        limit={data.limit}
        total={data.total}
        isFetching={isFetching}
        onPageChange={setPage}
      />

      {confirmDialog}
    </>
  );
}
