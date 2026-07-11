import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3501";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.namaPembeli || !body?.teleponPembeli || !body?.alamatPembeli || !Array.isArray(body?.items)) {
    return NextResponse.json({ message: "Data pesanan tidak lengkap" }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/pesanan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json({ message: data?.message ?? "Checkout gagal" }, { status: response.status });
  }
  return NextResponse.json(data);
}
