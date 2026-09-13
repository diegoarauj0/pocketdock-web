import { httpClient, ERROR_CODES, ApiResponseError, type ApiErrorCode } from "@/shared/http/http.client";
import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from "react";
import { authService, type InterfaceTokenResponse } from "../services/auth.service";
import type { InterfacePublicUser } from "@/features/users/services/users.service";
import { tokenStoreService } from "../services/tokenStore.service";
import { AuthContext } from "../contexts/auth.context";
import type { AxiosRequestConfig } from "axios";

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<"loading" | "refresh" | "authenticated" | "unauthenticated">("loading");
  const [user, setUser] = useState<InterfacePublicUser | null>(null);

  const refreshPromise = useRef<Promise<InterfaceTokenResponse> | null>(null);
  const mePromise = useRef<Promise<InterfacePublicUser> | null>(null);

  const refreshToken = useCallback(() => {
    if (refreshPromise.current) {
      return refreshPromise.current;
    }

    refreshPromise.current = authService.refresh();

    refreshPromise.current.finally(() => {
      refreshPromise.current = null;
    });

    return refreshPromise.current;
  }, []);

  const me = useCallback(() => {
    if (mePromise.current) {
      return mePromise.current;
    }

    mePromise.current = authService.me();

    mePromise.current.finally(() => {
      mePromise.current = null;
    });

    return mePromise.current;
  }, []);

  const signIn = useCallback(
    async (accessToken: string) => {
      tokenStoreService.set(accessToken);

      const user = await me();

      setState("authenticated");
      setUser(user);
    },
    [me],
  );

  const signOut = useCallback(() => {
    tokenStoreService.clear();

    setState("unauthenticated");
    setUser(null);
  }, []);

  useEffect(() => {
    const requestInterceptor = httpClient.interceptors.request.use((config) => {
      const token = tokenStoreService.get();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    const responseInterceptor = httpClient.interceptors.response.use(null, async (error) => {
      let errorCode = error?.response?.data?.error?.code as ApiErrorCode;
      let axiosError = error;

      if (error instanceof ApiResponseError) {
        axiosError = error.cause;
        errorCode = error.code;
      }

      const originalRequest = axiosError.config as AxiosRequestConfig & { _retry?: boolean };

      if (errorCode !== ERROR_CODES.INVALID_SESSION && errorCode !== ERROR_CODES.INVALID_TOKEN) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        signOut();
        return Promise.reject(error);
      }

      if (originalRequest.url?.includes("/api/auth/refresh")) {
        signOut();
        return Promise.reject(error);
      }

      try {
        console.log(originalRequest);
        originalRequest._retry = true;

        setState("refresh");

        const { access } = await refreshToken();

        tokenStoreService.set(access);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${access}`,
        };

        setState("authenticated");
        return httpClient(originalRequest);
      } catch (refreshError) {
        tokenStoreService.clear();

        setState("unauthenticated");
        return Promise.reject(refreshError);
      }
    });

    return () => {
      httpClient.interceptors.response.eject(responseInterceptor);
      httpClient.interceptors.request.eject(requestInterceptor);
    };
  }, [refreshToken, signOut]);

  useEffect(() => {
    me()
      .then((user) => {
        setState("authenticated");
        setUser(user);
      })
      .catch(() => {
        setState("unauthenticated");
        setUser(null);
      });
  }, [me]);

  return <AuthContext.Provider value={{ user, state, signIn, signOut, setUser }}>{children}</AuthContext.Provider>;
}
