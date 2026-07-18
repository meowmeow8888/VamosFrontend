import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  userId: number | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem("userId");

    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("userId", JSON.stringify(userId));
  }, [userId]);

  const refreshSession = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setUserId(data.id);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
      }
    } catch {
      setIsLoggedIn(true);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    setUserId(null);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loading, userId, refreshSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
