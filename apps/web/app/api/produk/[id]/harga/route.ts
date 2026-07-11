import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3501";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body?.hargaJual) {
    return NextResponse.json({ message: "hargaJual wajib diisi" }, { status: 400 });
  }

  const token = cookies().get("temuniaga_token")?.value;
  const res = await fetch(`${API_BASE_URL}/produk/${encodeURIComponent(params.id)}/harga`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ hargaJual: body.hargaJual }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json({ message: data?.message ?? "Gagal mengubah harga" }, { status: res.status });
  }
  return NextResponse.json(data);
}
