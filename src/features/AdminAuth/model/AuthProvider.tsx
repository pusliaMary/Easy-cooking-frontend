import { useState, useMemo, useEffect, type ReactNode } from "react";
import { AuthContext } from "./auth-context";
import { useCheckMeQuery } from "../api/authApi";
import { api } from "@/shared/api/api";

export interface UserData {
  username: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    api.util.resetApiState();
  };

  const { error, isFetching } = useCheckMeQuery(undefined, {
    skip: !user,
    pollingInterval: 60000,
  });

  useEffect(() => {
    if (error && "status" in error && error.status === 401) {
      queueMicrotask(() => {
        logout();
      });
    }
  }, [error]);

  const isLoggedIn = Boolean(user);

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      login,
      logout,
    }),
    [isLoggedIn, user],
  );

  if (user && isFetching && !isLoggedIn) {
    return <div>Loading session...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
