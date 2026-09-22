import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [displayName, setDisplayName] = useState(() => sessionStorage.getItem("displayName"));

  function login(newToken, newDisplayName) {
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("displayName", newDisplayName);
    setToken(newToken);
    setDisplayName(newDisplayName);
  }

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("displayName");
    setToken(null);
    setDisplayName(null);
  }

  return (
    <AuthContext.Provider value={{ token, displayName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
