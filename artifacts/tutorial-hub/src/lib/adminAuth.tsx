import { createContext, useContext, useState, useEffect, useCallback } from "react";

const TOKEN_KEY = "devdocs_admin_token";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      const stored = sessionStorage.getItem(TOKEN_KEY);
      if (!stored) { setIsLoading(false); return; }
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: stored }),
        });
        const data = await res.json() as { valid: boolean };
        if (data.valid) {
          setToken(stored);
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    void verify();
  }, []);

  const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        return { success: false, error: data.error ?? "Invalid password" };
      }
      const data = await res.json() as { token: string };
      setToken(data.token);
      sessionStorage.setItem(TOKEN_KEY, data.token);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    sessionStorage.removeItem(TOKEN_KEY);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated: !!token, isLoading, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}

export function getAdminToken(): string | null {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}
