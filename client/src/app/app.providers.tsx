import { QUERY_CONSTANT } from "@/shared/constants/query.constant";
import { ThemeProvider } from "@/features/theme/providers/theme.provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/providers/auth.provider";
import type { PropsWithChildren } from "react";
import { useState } from "react";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_CONSTANT.DEFAULT_STALE_TIME_MS,
            gcTime: QUERY_CONSTANT.DEFAULT_GC_TIME_MS,
            retry: QUERY_CONSTANT.DEFAULT_RETRY,
            refetchInterval: QUERY_CONSTANT.DEFAULT_REFETCH_INTERVAL_MS,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
