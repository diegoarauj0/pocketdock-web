import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as S from "./adminPagination.styled";

interface InterfaceAdminPaginationProps {
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  limit: number;
  total: number;
  page: number;
  itemsCount?: number;
}

export function AdminPaginationComponent({
  onPageChange,
  isFetching = false,
  limit,
  total,
  page,
  itemsCount,
}: InterfaceAdminPaginationProps) {
  const { t } = useTranslation("admin");

  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > 0 && (itemsCount === 0 || page >= totalPages)) {
      onPageChange(Math.max(0, totalPages - 1));
    }
  }, [itemsCount, page, totalPages, onPageChange]);

  if (total === 0) return null;

  const start = page * limit + 1;
  const end = Math.min((page + 1) * limit, total);

  return (
    <S.Pagination aria-label={t("PAGINATION_LABEL")}>
      <S.Info>{t("PAGINATION_INFO", { start, end, total })}</S.Info>

      <S.Controls>
        <S.Button
          type="button"
          aria-label={t("PAGINATION_PREVIOUS")}
          disabled={page <= 0 || isFetching}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </S.Button>

        <S.PageInfo>{t("PAGINATION_PAGE", { page: page + 1, totalPages })}</S.PageInfo>

        <S.Button
          type="button"
          aria-label={t("PAGINATION_NEXT")}
          disabled={page >= totalPages - 1 || isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </S.Button>
      </S.Controls>
    </S.Pagination>
  );
}
