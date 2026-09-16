import { Check, Copy } from "lucide-react";
import * as S from "./copyableValue.styled";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface InterfaceCopyableValueProps {
  panelURL: string;
  value: string;
}

export function CopyableValueComponent({ panelURL, value }: InterfaceCopyableValueProps) {
  const { t } = useTranslation("instances");
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
        {copied ? t("INSTANCE_COPIED") : t("INSTANCE_COPY")}
      </S.CopyButton>
    </S.CopyableValue>
  );
}
