import type { InterfacePublicUser } from "@/features/users/services/users.service";
import { createContext, useContext } from "react";

export type AuthStateType = "loading" | "refresh" | "authenticated" | "unauthenticated";

export interface InterfaceAuthContext {
  setUser: (user: InterfacePublicUser) => void;
  signIn: (accessToken: string) => void;
  user: InterfacePublicUser | null;
  state: AuthStateType;
  signOut: () => void;
}

export const AuthContext = createContext<InterfaceAuthContext | undefined>(undefined);

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error("useAuth must be used within a AuthProvider");

  return authContext;
}
