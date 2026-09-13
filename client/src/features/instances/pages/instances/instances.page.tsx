import { InstanceCardComponent } from "@/features/instances/components/instanceCard/instanceCard.component";
import { useCreateInstanceMutation } from "@/features/instances/mutations/useCreateInstanceMutation.hook";
import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { useInstancesQuery } from "@/features/instances/queries/useInstances.query";
import { ApiResponseError } from "@/shared/http/http.client";
import { notificationService } from "@/shared/services/notification.service";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { APP_CONSTANT } from "@/app/app.constant";
import * as S from "./instances.styled";
import { Plus } from "lucide-react";

export function InstancesPage() {
  const { data: instances, isLoading, isError } = useInstancesQuery();
  const createInstanceMutation = useCreateInstanceMutation();

  const total = instances?.length || 0;

  const notificationID = APP_CONSTANT.NOTIFICATION_IDS.CREATE_INSTANCE;

  const handleCreateInstance = () => {
    notificationService.loading("Creating instance...", notificationID);

    createInstanceMutation.mutate(undefined, {
      onSuccess: () => {
        notificationService.success("Instance created successfully.", notificationID);
      },
      onError: (error) => {
        if (error instanceof ApiResponseError) {
          notificationService.error(error.message, notificationID);
          return;
        }

        notificationService.error("Could not create the instance.", notificationID);
      },
    });
  };

  if (isLoading) return <LoadingScreenComponent />;

  if (isError) {
    return (
      <S.PageWrapper>
        <HeaderComponent />
        <S.Content>
          <S.InstancesHeader>
            <S.TextGroup>
              <S.Title>My instances</S.Title>
              <S.Subtitle>{total} instance(s)</S.Subtitle>
            </S.TextGroup>

            <S.NewButton type="button" onClick={handleCreateInstance}>
              <Plus size={16} />
              New instance
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
            <S.Title>My instances</S.Title>
            <S.Subtitle>{total} instance(s)</S.Subtitle>
          </S.TextGroup>

          <S.NewButton type="button" onClick={handleCreateInstance}>
            <Plus size={16} />
            New instance
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
