import { LoadingScreenComponent } from "@/shared/components/loadingScreen/loadingScreen.component";
import { HeaderComponent } from "@/shared/components/header/header.component";
import { ArrowLeft, Cpu, MemoryStick, Pause, Trash } from "lucide-react";
import { useInstanceQuery } from "../../queries/useInstance.query";
import { useStateQuery } from "../../queries/useState.query";
import { Link, useParams } from "react-router";
import { APP_PATH } from "@/app/app.path";
import * as S from "./instance.styled";

export function InstancePage() {
  const { ID } = useParams<{ ID: string }>();

  const instanceQuery = useInstanceQuery(ID);
  const stateQuery = useStateQuery(ID);

  if (stateQuery.isPending || instanceQuery.isPending) {
    return <LoadingScreenComponent />;
  }

  if (stateQuery.isError || instanceQuery.isError) {
    //Placeholder
    return (
      <div>
        <p>Deu ruim kkj</p>
      </div>
    );
  }

  const state = stateQuery.data!;
  const instance = instanceQuery.data!;

  return (
    <S.PageWrapper>
      <HeaderComponent />

      <S.Content>
        <S.InstanceHeader>
          <S.PreviewLink>
            <Link to={APP_PATH.INSTANCES}>
              <ArrowLeft /> Preview
            </Link>
          </S.PreviewLink>

          <S.TextGroup>
            <S.Title>{instance.containerName}</S.Title>
            <S.Subtitle>
              {location.protocol}//{instance.ID}.{location.host}
            </S.Subtitle>
          </S.TextGroup>

          <S.ButtonGroup>
            <S.PauseOrResumeInstance>
              <Pause /> Pausa
            </S.PauseOrResumeInstance>
            <S.DeleteInstance>
              <Trash /> Remover
            </S.DeleteInstance>
          </S.ButtonGroup>

          <S.Status>• Em execução</S.Status>
        </S.InstanceHeader>

        <S.InstanceUsage>
          <S.UsageCard>
            <S.UsageTitle>
              <Cpu />
              CPU
            </S.UsageTitle>
            <S.Usage>{state.cpu.percent.toFixed(2)}%</S.Usage>
          </S.UsageCard>

          <S.UsageCard>
            <S.UsageTitle>
              <MemoryStick />
              Memory
            </S.UsageTitle>
            <S.Usage>{state.memory.percent.toFixed(2)}%</S.Usage>
          </S.UsageCard>
        </S.InstanceUsage>
      </S.Content>
    </S.PageWrapper>
  );
}
