import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const data = await logIn(username, password);
  const response = NextResponse.json(data);

  response.cookies.set({
    name: "access_token",
    value: data["access_token"],
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

async function logIn(username: string, password: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (!response.ok) throw new Error("User authentication failed: login");

  return response.json();
}
