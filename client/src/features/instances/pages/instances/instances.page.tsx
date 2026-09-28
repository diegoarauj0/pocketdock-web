import { InstanceCardComponent } from "@/features/instances/components/instanceCard/instanceCard.component";
import { useCreateInstanceMutation } from "@/features/instances/mutations/useCreateInstance.mutation";
import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { translateServerError } from "@/features/locale/services/translateServerError.service";
import { useInstancesQuery } from "@/features/instances/queries/useInstances.query";
import { notificationService } from "@/shared/services/notification.service";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { INSTANCE_CONSTANT } from "@/features/instances/constants/instance.constant";
import { useTranslation } from "react-i18next";
import * as S from "./instances.styled";
import { Plus } from "lucide-react";

export function InstancesPage() {
  const { data: instances, isLoading, isError } = useInstancesQuery();
  const createInstanceMutation = useCreateInstanceMutation();
  const { t } = useTranslation("instances");

  const total = instances?.length || 0;

  const notificationID = INSTANCE_CONSTANT.NOTIFICATION_IDS.CREATE_INSTANCE;

  const handleCreateInstance = () => {
    notificationService.loading(t("NOTIFICATION_CREATE_INSTANCE_LOADING"), notificationID);

    createInstanceMutation.mutate(undefined, {
      onSuccess: () => {
        notificationService.success(t("NOTIFICATION_CREATE_INSTANCE_SUCCESS"), notificationID);
      },
      onError: (error) => {
        notificationService.error(
          translateServerError(t, error, t("NOTIFICATION_CREATE_INSTANCE_ERROR")),
          notificationID,
        );
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
              <S.Title>{t("INSTANCES_TITLE")}</S.Title>
              <S.Subtitle>{t("INSTANCE_COUNT", { count: total })}</S.Subtitle>
            </S.TextGroup>

            <S.NewButton type="button" onClick={handleCreateInstance}>
              <Plus size={16} />
              {t("INSTANCES_NEW_BUTTON")}
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
            <S.Title>{t("INSTANCES_TITLE")}</S.Title>
            <S.Subtitle>{t("INSTANCE_COUNT", { count: total })}</S.Subtitle>
          </S.TextGroup>

          <S.NewButton type="button" onClick={handleCreateInstance}>
            <Plus size={16} />
            {t("INSTANCES_NEW_BUTTON")}
          </S.NewButton>
        </S.InstancesHeader>

        <S.CardsGrid>
          {instances?.map((instance) => (
            <InstanceCardComponent key={instance.id} instance={instance} />
          ))}
        </S.CardsGrid>
      </S.Content>
    </S.PageWrapper>
  );
}
