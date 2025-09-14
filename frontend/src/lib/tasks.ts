export type Status = "todo" | "in_progress" | "done";
export type Priority = "high" | "medium" | "low" | "none";

export type TaskInput = {
  title: string;
  description?: string;
  status?: Status | string;
  dueDate?: string;
  priority?: Priority | string;
};

export async function createTask(task: TaskInput) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task }),
    credentials: "include",
  });

  console.log(task);

  if (!response.ok) throw new Error("Failed to create task");

  window.location.reload();
}

export async function getTasks() {
  const response = await fetch("/api/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to create task");

  const data = await response.json();

  return data;
}

export async function updateTask(taskId: string, task: TaskInput) {
  const response = await fetch("/api/tasks", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId, task }),
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to create task");

  window.location.reload();
}

export async function deleteTask(taskId: string) {
  const response = await fetch("/api/tasks", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId }),
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to create task");

  window.location.reload();
}
