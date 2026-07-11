import { config } from "./config";

async function apiFetch(pathname: string, init?: RequestInit): Promise<{ status: number; body: any }> {
  const response = await fetch(`${config.apiBaseUrl}${pathname}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

export interface WaRegistration {
  phone: string;
  anggotaRef: string | null;
  koperasiRef: string | null;
}

export async function lookupRegistration(phone: string): Promise<WaRegistration | null> {
  const { status, body } = await apiFetch(`/wa/register/${encodeURIComponent(phone)}`);
  return status === 200 ? body : null;
}

export interface HargaResult {
  komoditas: string;
  region: string;
  hargaMin: string;
  hargaMedian: string;
  hargaMax: string;
  unit: string;
  sumber: string;
  updatedAt: string;
}

export async function getHarga(komoditas: string): Promise<HargaResult | null> {
  const { status, body } = await apiFetch(`/harga/${encodeURIComponent(komoditas)}`);
  return status === 200 ? body : null;
}

export interface LaporResult {
  supplyLotId: string;
  status: string;
  komoditas: string;
  quantity: number;
  unit: string;
}

export async function laporPasokan(params: {
  koperasiRef: string;
  komoditas: string;
  quantity: number;
  unit: string;
  memberRef?: string;
}): Promise<{ ok: true; data: LaporResult } | { ok: false; message: string }> {
  const { status, body } = await apiFetch("/pasokan", { method: "POST", body: JSON.stringify(params) });
  if (status === 201 || status === 200) return { ok: true, data: body };
  return { ok: false, message: body?.message ?? "Gagal mencatat laporan pasokan" };
}

export interface SimpananStatus {
  anggotaRef: string;
  nama: string | null;
  riwayatSimpanan: Array<{ periode: string | null; jumlah: string; status: string | null; dibayarPada: string | null }>;
}

export async function getSimpananStatus(anggotaRef: string): Promise<SimpananStatus | null> {
  const { status, body } = await apiFetch(`/simpanan/status/${encodeURIComponent(anggotaRef)}`);
  return status === 200 ? body : null;
}
