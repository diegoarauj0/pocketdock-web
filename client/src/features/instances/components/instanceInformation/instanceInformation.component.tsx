import type { InterfaceInstance } from "../../services/instances.service";
import { formatDateTime } from "@/shared/utils/formatDate.util";
import { CopyableValueComponent } from "../copyableValue/copyableValue.component";
import { useTranslation } from "react-i18next";
import * as S from "./instanceInformation.styled";

interface InterfaceInstanceInformationProps {
  instance: InterfaceInstance;
}

export function InstanceInformationComponent({ instance }: InterfaceInstanceInformationProps) {
  const { t } = useTranslation("instances");

  const panelURL = `${instance.url}/_/`;

  return (
    <S.InstanceInformation>
      <S.TextGroup>
        <S.Title>{t("INSTANCE_INFORMATION_TITLE")}</S.Title>
      </S.TextGroup>

      <S.InstanceRow>
        <S.FieldLabel>{t("INSTANCE_INFORMATION_ID")}</S.FieldLabel>
        <S.FieldValue>{instance.id}</S.FieldValue>
      </S.InstanceRow>

      <S.InstanceRow>
        <S.FieldLabel>{t("INSTANCE_INFORMATION_CREATED_AT")}</S.FieldLabel>
        <S.FieldValue>{formatDateTime(instance.createdAt)}</S.FieldValue>
      </S.InstanceRow>

      <S.InstanceRow $full={true}>
        <S.FieldLabel>{t("INSTANCE_INFORMATION_PANEL_URL")}</S.FieldLabel>

        <CopyableValueComponent panelURL={panelURL} value={panelURL} />
      </S.InstanceRow>

      <S.InstanceRow $full={true}>
        <S.FieldLabel>{t("INSTANCE_INFORMATION_API_URL")}</S.FieldLabel>

        <CopyableValueComponent panelURL={instance.url} value={instance.url} />
      </S.InstanceRow>

      <S.InstanceRow $full={true}>
        <S.FieldLabel>{t("INSTANCE_INFORMATION_DEFAULT_PASSWORD")}</S.FieldLabel>

        <CopyableValueComponent panelURL={instance.defaultPassword} value={instance.defaultPassword} />
      </S.InstanceRow>

      <S.LoginNotice>{t("INSTANCE_INFORMATION_LOGIN_NOTICE")}</S.LoginNotice>

      <S.CredentialsNotice>{t("INSTANCE_INFORMATION_CREDENTIALS_NOTICE", { panelURL })}</S.CredentialsNotice>
    </S.InstanceInformation>
  );
}
