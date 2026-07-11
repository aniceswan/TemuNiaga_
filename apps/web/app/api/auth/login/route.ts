import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3501";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json({ message: data?.message ?? "Login gagal" }, { status: response.status });
  }

  const result = NextResponse.json({ user: data.user });
  result.cookies.set("temuniaga_token", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // matches apps/api's 8h JWT expiry
  });
  return result;
}
