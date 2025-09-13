import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();
  const data = await signUp(username, email, password);
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

async function signUp(username: string, email: string, password: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
    credentials: "include",
  });

  console.log(response.body);

  if (!response.ok) throw new Error("User authentication failed: sign up");

  return response.json();
}
