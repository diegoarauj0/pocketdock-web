import type { InterfaceConfirmDialogOptions } from "@/shared/hooks/useConfirmDialog.hook";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import * as S from "./confirmDialog.styled";

interface InterfaceConfirmDialogProps extends InterfaceConfirmDialogOptions {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialogComponent({
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "default",
  onConfirm,
  onCancel,
}: InterfaceConfirmDialogProps) {
  const titleID = useId();
  const descriptionID = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return createPortal(
    <S.Overlay onMouseDown={onCancel}>
      <S.Dialog
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleID}
        aria-describedby={descriptionID}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <S.Title id={titleID}>{title}</S.Title>
        <S.Description id={descriptionID}>{description}</S.Description>

        <S.Actions>
          <S.CancelButton ref={cancelButtonRef} type="button" onClick={onCancel}>
            {cancelLabel}
          </S.CancelButton>

          <S.ConfirmButton type="button" $danger={variant === "danger"} onClick={onConfirm}>
            {confirmLabel}
          </S.ConfirmButton>
        </S.Actions>
      </S.Dialog>
    </S.Overlay>,
    document.body,
  );
}
