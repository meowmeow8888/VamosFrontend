import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNotifications } from "../hooks/useNotifications";

type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  userId: number | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token } = useNotifications();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem("userId");
    if (!saved || saved === "undefined") return null;
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Failed to parse userId from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("userId", JSON.stringify(userId));
  }, [userId]);

  const refreshSession = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/me`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetch(`${BASE_URL}/api/device-token`, {
        method: "POST",
        credentials: "include", // Ensures backend knows WHICH user is sending this
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch((err) => console.error("Failed to sync device token:", err));
    }
  }, [isLoggedIn, token]);

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
