import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // payload from /auth/me
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");

      if (res?.data?.success) {
        // ✅ Compatible avec 2 formats possibles:
        // 1) { success: true, user: {...} }
        // 2) { success: true, data: {...} }
        const u = res.data.user ?? res.data.data ?? null;
        setUser(u);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (localStorage.getItem("eventsphere_token")) {
        await fetchMe();
      } else {
        setUser(null);
      }
      setLoading(false);
    })();
  }, [fetchMe]);

  const login = useCallback(
    async ({ email, password }) => {
      const res = await api.post("/auth/login", { email, password });
      if (!res?.data?.success || !res?.data?.token) {
        throw new Error(res?.data?.message || "Login failed");
      }
      localStorage.setItem("eventsphere_token", res.data.token);
      await fetchMe();
      return res.data;
    },
    [fetchMe]
  );

  const register = useCallback(async (payload) => {
    const res = await api.post("/auth/register", payload);
    if (!res?.data?.success) {
      throw new Error(res?.data?.message || "Register failed");
    }
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("eventsphere_token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      refreshMe: fetchMe,
    }),
    [user, loading, login, register, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
