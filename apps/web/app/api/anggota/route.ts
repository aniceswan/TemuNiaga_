import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3501";

// Proxies GET /koperasi/:ref/anggota so the WA registration form's client-side
// koperasi-picker can look up members without apps/web ever exposing
// API_BASE_URL to the browser (same reasoning as lib/api.ts).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const koperasiRef = searchParams.get("koperasiRef");
  if (!koperasiRef) {
    return NextResponse.json({ message: "koperasiRef wajib diisi" }, { status: 400 });
  }

  const res = await fetch(`${API_BASE_URL}/koperasi/${encodeURIComponent(koperasiRef)}/anggota?pageSize=100`, {
    cache: "no-store",
  });
  const body = await res.json().catch(() => null);
  return NextResponse.json(body, { status: res.status });
}
