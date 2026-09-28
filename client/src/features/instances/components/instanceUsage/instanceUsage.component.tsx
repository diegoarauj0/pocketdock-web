import { Cpu, MemoryStick } from "lucide-react";
import * as S from "./instanceUsage.styled";
import { useTranslation } from "react-i18next";
import type { ReactElement } from "react";
import type { InterfaceState } from "../../services/instances.service";

interface InterfaceUsageCardProps {
  icon: ReactElement;
  title: string;
  value: string;
}

function UsageCardComponent({ icon, title, value }: InterfaceUsageCardProps) {
  return (
    <S.UsageCard>
      <S.UsageTitle>
        {icon}
        {title}
      </S.UsageTitle>
      <S.Usage>{value}</S.Usage>
    </S.UsageCard>
  );
}

export function InstanceUsageComponent({ state }: { state: InterfaceState }) {
  const { t } = useTranslation("instances");

  return (
    <S.InstanceUsage>
      <UsageCardComponent icon={<Cpu />} title={t("INSTANCE_USAGE_CPU")} value={`${state.cpu.percent.toFixed(2)}%`} />
      <UsageCardComponent
        icon={<MemoryStick />}
        title={t("INSTANCE_USAGE_MEMORY")}
        value={`${state.memory.percent.toFixed(2)}%`}
      />
    </S.InstanceUsage>
  );
}
