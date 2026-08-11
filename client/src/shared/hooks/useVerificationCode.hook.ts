import type { ChangeEvent, ClipboardEvent, KeyboardEvent, RefCallback, SubmitEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

interface InterfaceUseVerificationCodeParams {
  length: number;
}

export interface InterfaceCodeInputRegister {
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ref: RefCallback<HTMLInputElement>;
  autoComplete: "off";
  maxLength: number;
  inputMode: "text";
  value: string;
}

interface InterfaceUseVerificationCodeReturn {
  handleSubmit: (callback: (code: string) => void) => (event: SubmitEvent<HTMLFormElement>) => void;
  getCodeInputRegister: (index: number) => InterfaceCodeInputRegister;
  isComplete: boolean;
  reset: () => void;
  error: string;
}

export function useVerificationCode(props: InterfaceUseVerificationCodeParams): InterfaceUseVerificationCodeReturn {
  const { length } = props;

  const [values, setValues] = useState<string[]>(() => Array.from({ length }, () => ""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [error, setError] = useState("");

  const isComplete = useMemo(() => values.every((value) => value !== ""), [values]);
  const code = useMemo(() => values.join(""), [values]);

  const focusInput = useCallback((index: number) => {
    const input = inputsRef.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  const getCodeInputRegister = useCallback(
    (index: number): InterfaceCodeInputRegister => {
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const digit = event.target.value.slice(-1);

        setValues((prev) => {
          const next = [...prev];
          next[index] = digit;
          return next;
        });

        if (digit && index < length - 1) {
          focusInput(index + 1);
        }
      };

      const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !values[index] && index > 0) {
          focusInput(index - 1);
        } else if (event.key === "ArrowLeft" && index > 0) {
          focusInput(index - 1);
        } else if (event.key === "ArrowRight" && index < length - 1) {
          focusInput(index + 1);
        }
      };

      const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();

        const pastedCode = event.clipboardData.getData("text").replace(/\s+/g, "").slice(0, length);
        if (!pastedCode) return;

        setValues((prev) => {
          const next = [...prev];

          pastedCode.split("").forEach((character, offset) => {
            const targetIndex = index + offset;

            if (targetIndex < length) next[targetIndex] = character;
          });
          return next;
        });

        focusInput(Math.min(index + pastedCode.length, length - 1));
      };

      const setInputRef: RefCallback<HTMLInputElement> = (element) => {
        inputsRef.current[index] = element;
      };

      return {
        ref: setInputRef,
        value: values[index],
        maxLength: 1,
        inputMode: "text",
        autoComplete: "off",
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onPaste: handlePaste,
      };
    },
    [focusInput, length, values],
  );

  const handleSubmit = useCallback(
    (callback: (code: string) => void) => {
      return (event: SubmitEvent) => {
        event.preventDefault();

        if (!isComplete) {
          return setError(`Enter the ${length}-character code to continue.`);
        }

        setError("");
        callback(code);
      };
    },
    [code, isComplete, length],
  );

  const reset = useCallback(() => {
    setValues(Array.from({ length }, () => ""));
    focusInput(0);
    setError("");
  }, [focusInput, length]);

  return { handleSubmit, getCodeInputRegister, error, isComplete, reset };
}
