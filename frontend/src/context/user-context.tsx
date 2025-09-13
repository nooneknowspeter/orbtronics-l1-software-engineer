"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  username: string;
  setUsername: (value: string) => void;
}

const UserContext = createContext<UserContextType>({
  username: "Account",
  setUsername: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("Account");

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsername = () => useContext(UserContext);
