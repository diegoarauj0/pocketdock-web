import type { InterfaceInstance } from "../../services/instances.service";
import { CopyableValueComponent } from "../copyableValue/copyableValue.component";
import * as S from "./instanceInformation.styled";

const formatCreatedAt = (date: string): string => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(new Date(date));
};

export function InstanceInformationComponent({ instance }: { instance: InterfaceInstance }) {
  const panelURL = `${instance.url}/_/`;

  return (
    <S.InstanceInformation>
      <S.TextGroup>
        <S.Title>Instance information</S.Title>
      </S.TextGroup>

      <S.InstanceRow>
        <S.FieldLabel>ID</S.FieldLabel>
        <S.FieldValue>{instance.ID}</S.FieldValue>
      </S.InstanceRow>

      <S.InstanceRow>
        <S.FieldLabel>Created at</S.FieldLabel>
        <S.FieldValue>{formatCreatedAt(instance.createdAt)}</S.FieldValue>
      </S.InstanceRow>

      <S.InstanceRow $full={true}>
        <S.FieldLabel>Panel URL</S.FieldLabel>

        <CopyableValueComponent panelURL={panelURL} value={panelURL} />
      </S.InstanceRow>

      <S.InstanceRow $full={true}>
        <S.FieldLabel>API URL</S.FieldLabel>

        <CopyableValueComponent panelURL={instance.url} value={instance.url} />
      </S.InstanceRow>

      <S.InstanceRow $full={true}>
        <S.FieldLabel>Default password</S.FieldLabel>

        <CopyableValueComponent panelURL={instance.defaultPassword} value={instance.defaultPassword} />
      </S.InstanceRow>

      <S.LoginNotice>The login email for this instance is the same one you use to sign in to PocketDock.</S.LoginNotice>

      <S.CredentialsNotice>Change this password after the first login at {panelURL}.</S.CredentialsNotice>
    </S.InstanceInformation>
  );
}
