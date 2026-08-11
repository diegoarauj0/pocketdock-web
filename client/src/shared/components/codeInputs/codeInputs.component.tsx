import type { InterfaceCodeInputRegister } from "@/shared/hooks/useVerificationCode.hook";
import * as S from "./codeInputs.styled";

interface InterfaceCodeInputsProps {
  getCodeInputRegister: (index: number) => InterfaceCodeInputRegister;
  length: number;
}

export function CodeInputsComponent({ length, getCodeInputRegister }: InterfaceCodeInputsProps) {
  return (
    <S.CodeInputs>
      {Array.from({ length }, (_, index) => (
        <S.Input key={index} autoFocus={index === 0} {...getCodeInputRegister(index)} />
      ))}
    </S.CodeInputs>
  );
}
