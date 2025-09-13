"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  setAuthenticated: () => {},
});

export function AuthProvider({
  children,
  initialAuthenticated = false,
}: {
  children: ReactNode;
  initialAuthenticated?: boolean;
}) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
