import type { InterfaceInstance } from "@/features/instances/services/instances.service";
import { formatDateTime } from "@/shared/utils/formatDate.util";
import { INSTANCE_CONSTANT } from "../../constants/instance.constant";
import { useTranslation } from "react-i18next";
import * as S from "./instanceCard.styled";
import { Container } from "lucide-react";

interface InterfaceInstanceCardProps {
  instance: InterfaceInstance;
}

export function InstanceCardComponent({ instance }: InterfaceInstanceCardProps) {
  const { t } = useTranslation("instances");

  return (
    <S.Card to={`/${INSTANCE_CONSTANT.ROUTER.INSTANCE}/${instance.ID}`}>
      <S.Header>
        <S.IconArea>
          <Container size={24} />
        </S.IconArea>

        <S.Name>{instance.containerName}</S.Name>
      </S.Header>

      <S.Content>
        <S.Id>{instance.ID}</S.Id>
      </S.Content>

      <S.MetaList>
        <S.MetaItem>
          <S.Label>{t("INSTANCE_CARD_CREATED")}</S.Label>
          <S.Value>{formatDateTime(instance.createdAt)}</S.Value>
        </S.MetaItem>

        <S.MetaItem>
          <S.Label>{t("INSTANCE_CARD_UPDATED")}</S.Label>
          <S.Value>{formatDateTime(instance.updatedAt)}</S.Value>
        </S.MetaItem>
      </S.MetaList>
    </S.Card>
  );
}
