import { InstanceCardComponent } from "@/features/instances/components/instanceCard/instanceCard.component";
import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { useInstancesQuery } from "@/features/instances/queries/useInstances.query";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { httpService } from "@/shared/services/http.service";
import * as S from "./instances.styled";
import { Plus } from "lucide-react";

export function InstancesPage() {
  const { data: instances, isLoading, isError } = useInstancesQuery();

  const total = instances?.length || 0;

  if (isLoading) return <LoadingScreenComponent />;

  if (isError) {
    return (
      <S.PageWrapper>
        <HeaderComponent />
        <S.Content>
          <S.InstancesHeader>
            <S.TextGroup>
              <S.Title>Minhas instâncias</S.Title>
              <S.Subtitle>{total} instância(s)</S.Subtitle>
            </S.TextGroup>

            <S.NewButton
              type="button"
              onClick={() => {
                httpService.post("/api/instances", undefined);
              }}
            >
              <Plus size={16} />
              Nova instância
            </S.NewButton>
          </S.InstancesHeader>
        </S.Content>
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <HeaderComponent />

      <S.Content>
        <S.InstancesHeader>
          <S.TextGroup>
            <S.Title>Minhas instâncias</S.Title>
            <S.Subtitle>{total} instância(s)</S.Subtitle>
          </S.TextGroup>

          <S.NewButton
            type="button"
            onClick={() => {
              httpService.post("/api/instances", undefined);
            }}
          >
            <Plus size={16} />
            Nova instância
          </S.NewButton>
        </S.InstancesHeader>

        <S.CardsGrid>
          {instances?.map((instance) => (
            <InstanceCardComponent key={instance.ID} instance={instance} />
          ))}
        </S.CardsGrid>
      </S.Content>
    </S.PageWrapper>
  );
}
