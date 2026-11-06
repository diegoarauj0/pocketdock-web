import { Link } from "react-router";
import * as S from "./formHeader.styled";

interface InterfaceFormHeaderProps {
  subtitle: string;
  brand: string;
  title: string;
}

export function FormHeaderComponent({ brand, subtitle, title }: InterfaceFormHeaderProps) {
  return (
    <>
      <S.Brand>
        <Link to={"/"}>{brand}</Link>
      </S.Brand>
      <S.Title>{title}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
    </>
  );
}
