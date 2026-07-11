import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3501";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.phone) {
    return NextResponse.json({ message: "Nomor WA wajib diisi" }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/wa/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: body.phone,
      anggotaRef: body.anggotaRef || undefined,
      koperasiRef: body.koperasiRef || undefined,
    }),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json({ message: data?.message ?? "Gagal mendaftarkan nomor WA" }, { status: response.status });
  }
  return NextResponse.json(data);
}
