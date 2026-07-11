import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3501";

function authHeaders(): HeadersInit {
  const token = cookies().get("temuniaga_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Proxies operator-only produk endpoints so the httpOnly session cookie never
// has to be exposed to client-side JS (same reasoning as lib/api.ts).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const koperasiRef = searchParams.get("koperasiRef");
  if (!koperasiRef) {
    return NextResponse.json({ message: "koperasiRef wajib diisi" }, { status: 400 });
  }

  const res = await fetch(`${API_BASE_URL}/produk/koperasi/${encodeURIComponent(koperasiRef)}?pageSize=100`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const body = await res.json().catch(() => null);
  return NextResponse.json(body, { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.koperasiRef || !body?.namaProduk || !body?.hargaJual) {
    return NextResponse.json({ message: "Data produk tidak lengkap" }, { status: 400 });
  }

  const res = await fetch(`${API_BASE_URL}/produk`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json({ message: data?.message ?? "Gagal menambah produk" }, { status: res.status });
  }
  return NextResponse.json(data);
}
