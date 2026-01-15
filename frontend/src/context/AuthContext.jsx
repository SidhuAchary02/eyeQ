import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first for persisted user
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("access_token");
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    // If no stored user, try to fetch from /auth/me endpoint
    axios
      .get("http://localhost:8000/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

