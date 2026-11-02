import { ConfirmDialogComponent } from "@/shared/components/confirmDialog/confirmDialog.component";
import { useCallback, useEffect, useRef, useState } from "react";

export interface InterfaceConfirmDialogOptions {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: "default" | "danger";
}

export function useConfirmDialog() {
  const [options, setOptions] = useState<InterfaceConfirmDialogOptions | null>(null);
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = useCallback((nextOptions: InterfaceConfirmDialogOptions) => {
    resolverRef.current?.(false);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(nextOptions);
    });
  }, []);

  const close = useCallback((confirmed: boolean) => {
    resolverRef.current?.(confirmed);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  const handleConfirm = useCallback(() => close(true), [close]);
  const handleCancel = useCallback(() => close(false), [close]);

  useEffect(() => {
    return () => {
      resolverRef.current?.(false);
      resolverRef.current = null;
    };
  }, []);

  const confirmDialog = options ? (
    <ConfirmDialogComponent
      {...options}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, confirmDialog };
}
