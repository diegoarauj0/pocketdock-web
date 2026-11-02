import type { ReactNode } from "react";
import * as S from "./segmentedControl.styled";

export interface InterfaceSegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface InterfaceSegmentedControlProps<T extends string> {
  ariaLabel: string;
  value: T;
  options: readonly InterfaceSegmentedControlOption<T>[];
  onChange: (value: T) => void;
}

export function SegmentedControlComponent<T extends string>({
  ariaLabel,
  value,
  options,
  onChange,
}: InterfaceSegmentedControlProps<T>) {
  return (
    <S.Group role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <S.Option
            key={option.value}
            type="button"
            $active={isActive}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.icon}
            {option.label}
          </S.Option>
        );
      })}
    </S.Group>
  );
}
