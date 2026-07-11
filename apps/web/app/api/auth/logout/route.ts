import { NextResponse } from "next/server";

export async function POST() {
  const result = NextResponse.json({ ok: true });
  result.cookies.delete("temuniaga_token");
  return result;
}
