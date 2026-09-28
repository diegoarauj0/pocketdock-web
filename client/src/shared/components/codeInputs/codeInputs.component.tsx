import * as S from "./codeInputs.styled";
import { OTPInput } from "input-otp";

interface InterfaceCodeInputsProps {
  length: number;
  value: string;
  onChange: (nextCode: string) => void;
}

export function CodeInputsComponent({ length, value, onChange }: InterfaceCodeInputsProps) {
  return (
    <OTPInput
      value={value}
      maxLength={length}
      autoComplete="off"
      inputMode="text"
      onChange={onChange}
      render={({ slots }) => (
        <S.CodeBoxRow>
          {slots.map((slot, index) => (
            <S.CodeBox key={index} $filled={Boolean(slot.char)} $active={slot.isActive}>
              {slot.char ?? ""}
              {slot.hasFakeCaret && <S.CodeCaret />}
            </S.CodeBox>
          ))}
        </S.CodeBoxRow>
      )}
    />
  );
}
