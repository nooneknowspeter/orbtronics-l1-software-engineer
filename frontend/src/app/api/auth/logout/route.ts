import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.delete("access_token");

  return response;
}
