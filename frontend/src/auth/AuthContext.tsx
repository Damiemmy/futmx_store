import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/endpoints";
import {
  clearTokens,
  getAccessToken,
  getErrorMessage,
  setTokens,
} from "../api/client";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  handleOAuthCallback: (access: string, refresh: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await authApi.me();
      setUser(data);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username: string, password: string) => {
    const { data } = await authApi.login(username, password);
    setTokens(data.access, data.refresh);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.username}!`);
  };

  const logout = async () => {
    const refresh = sessionStorage.getItem("refresh");
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // ignore logout errors
    }
    clearTokens();
    setUser(null);
    toast.success("Logged out successfully.");
  };

  const handleOAuthCallback = async (access: string, refresh: string) => {
    setTokens(access, refresh);
    const { data } = await authApi.me();
    setUser(data);
    toast.success(`Welcome, ${data.username}!`);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      setUser,
      handleOAuthCallback,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export async function safeAuthAction(
  action: () => Promise<void>,
  fallbackMessage = "Something went wrong."
) {
  try {
    await action();
  } catch (error) {
    toast.error(getErrorMessage(error) || fallbackMessage);
    throw error;
  }
}
