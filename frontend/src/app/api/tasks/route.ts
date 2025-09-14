import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const taskData = await request.json();

  console.log(taskData);

  const token = await getToken();

  const response = await fetch(`${process.env.BACKEND_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData.task),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error("Failed to create tasks data");

  return NextResponse.json(data);
}

export async function GET() {
  const token = await getToken();

  const response = await fetch(`${process.env.BACKEND_URL}/api/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error("Failed to get tasks data");

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const taskData = await request.json();
  const taskId = taskData.taskId;

  console.log(taskData.task);

  const token = await getToken();

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData.task),
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) throw new Error("Failed to update task");

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const taskData = await request.json();
  const taskId = taskData.taskId;

  const token = await getToken();

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) throw new Error("Failed to delete task");

  return NextResponse.json(data);
}

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!!!token) throw new Error("Invalid token");

  return token as string;
}
