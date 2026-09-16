import { Check, Copy } from "lucide-react";
import * as S from "./copyableValue.styled";
import { useCallback, useState } from "react";

interface InterfaceCopyableValueProps {
  panelURL: string;
  value: string;
}

export function CopyableValueComponent({ panelURL, value }: InterfaceCopyableValueProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async () => {
    if (copied) return;

    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }, [value, copied]);

  return (
    <S.CopyableValue>
      <S.FieldValue>{panelURL}</S.FieldValue>
      <S.CopyButton type="button" onClick={() => handleCopy()}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </S.CopyButton>
    </S.CopyableValue>
  );
}
