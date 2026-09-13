import type { InterfaceInstance } from "@/features/instances/services/instances.service";
import { APP_CONSTANT } from "@/app/app.constant";
import * as S from "./instanceCard.styled";
import { Container } from "lucide-react";

interface InterfaceInstanceCardProps {
  instance: InterfaceInstance;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function InstanceCardComponent({ instance }: InterfaceInstanceCardProps) {
  return (
    <S.Card to={`/${APP_CONSTANT.ROUTER.INSTANCES.INSTANCE}/${instance.ID}`}>
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
          <S.Label>Criada em:</S.Label>
          <S.Value>{formatDate(instance.createdAt)}</S.Value>
        </S.MetaItem>

        <S.MetaItem>
          <S.Label>Atualizada em:</S.Label>
          <S.Value>{formatDate(instance.updatedAt)}</S.Value>
        </S.MetaItem>
      </S.MetaList>
    </S.Card>
  );
}
