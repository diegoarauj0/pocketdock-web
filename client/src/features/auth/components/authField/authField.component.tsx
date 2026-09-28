import type { ChangeEvent } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import * as S from "./authField.styled";

interface InterfaceAuthFieldProps {
  placeholder: string;
  htmlFor: string;
  label: string;
  type: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  register?: UseFormRegisterReturn;
  error?: string;
}

export function AuthFieldComponent({
  htmlFor,
  label,
  type,
  placeholder,
  value,
  onChange,
  register,
  error,
}: InterfaceAuthFieldProps) {
  return (
    <S.Field>
      <S.Label htmlFor={htmlFor}>{label}</S.Label>
      <S.Input
        id={htmlFor}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...register}
        $hasError={Boolean(error)}
      />
      {error && <S.ErrorMessage role="alert">{error}</S.ErrorMessage>}
    </S.Field>
  );
}
