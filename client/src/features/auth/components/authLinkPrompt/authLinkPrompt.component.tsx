import * as S from "./authLinkPrompt.styled";

interface InterfaceAuthLinkPromptProps {
  text: string;
  linkLabel: string;
  linkTo: string;
}

export function AuthLinkPromptComponent({ text, linkLabel, linkTo }: InterfaceAuthLinkPromptProps) {
  return (
    <S.Prompt>
      {text} <S.PromptLink to={linkTo}>{linkLabel}</S.PromptLink>
    </S.Prompt>
  );
}
