import { Cpu, MemoryStick } from "lucide-react";
import * as S from "./instanceUsage.styled";
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
  return (
    <S.InstanceUsage>
      <UsageCardComponent icon={<Cpu />} title="CPU" value={`${state.cpu.percent.toFixed(2)}%`} />
      <UsageCardComponent icon={<MemoryStick />} title="Memory" value={`${state.memory.percent.toFixed(2)}%`} />
    </S.InstanceUsage>
  );
}
