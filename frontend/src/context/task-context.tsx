"use client";

import { createContext, useContext, useState } from "react";

type TaskContextType = {
  selectedTaskId: string | null;
  setSelectedTaskId: (task: string | null) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return (
    <TaskContext.Provider value={{ selectedTaskId, setSelectedTaskId }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask must be used within TaskProvider");
  return context;
}
