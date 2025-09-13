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

export function UserProvider({
  children,
  initialUsername = "Account",
}: {
  children: ReactNode;
  initialUsername?: string;
}) {
  const [username, setUsername] = useState(initialUsername);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsername = () => useContext(UserContext);
