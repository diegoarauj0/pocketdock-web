import { flattenError } from "zod/v4/core";
import { getVerificationCodeSchema } from "../validations/verificationCode.validation";
import { useCallback, useMemo, useState, type SubmitEventHandler } from "react";

interface InterfaceUseVerificationCodeParams {
  length: number;
}

export function useVerificationCode(props: InterfaceUseVerificationCodeParams) {
  const { length } = props;

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const schema = useMemo(() => getVerificationCodeSchema(length), [length]);

  const handleCodeChange = useCallback((nextCode: string) => {
    setCode(nextCode);
    setError(undefined);
  }, []);

  const handleSubmit = useCallback(
    (callback: (code: string) => void) => {
      const handle: SubmitEventHandler = (event) => {
        (async () => {
          event.preventDefault();

          setError(undefined);

          const result = await schema.safeParseAsync({ code });

          if (result.error) {
            return setError(flattenError(result.error).fieldErrors.code?.[0]);
          }

          callback(result.data.code);
        })();
      };

      return handle;
    },
    [schema, code],
  );

  const reset = useCallback(() => {
    setCode("");
  }, []);

  return {
    handleSubmit,
    handleCodeChange,
    reset,
    error,
    setError,
    code,
    setCode,
  };
}
