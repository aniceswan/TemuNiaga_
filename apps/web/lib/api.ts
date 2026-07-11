// Server-side API client -- every data-fetching page in apps/web goes
// through apps/api over HTTP, never through Prisma directly. This is what
// makes apps/web deployable independently of the database/backend (e.g.
// frontend on Vercel, backend + Postgres running locally behind a tunnel):
// the only thing that has to change between "full local" and "frontend
// deployed" is the API_BASE_URL env var. See README.md "Mode Deployment".

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3501";

async function apiGet<T>(pathname: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${pathname}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GET ${pathname} failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  return res.json() as Promise<T>;
}

export interface DashboardTotals {
  totalKoperasi: number;
  totalAnggota: number;
  totalSimpanan: string;
}

export function getDashboardTotals(): Promise<DashboardTotals> {
  return apiGet<DashboardTotals>("/koperasi/dashboard-totals");
}

export interface KoperasiSummary {
  koperasiRef: string;
  namaKoperasi: string;
  statusRegistrasi: string | null;
  bentukKoperasi: string | null;
  kategoriUsaha: string | null;
  alamatLengkap: string | null;
}

export interface KoperasiListResponse {
  total: number;
  items: KoperasiSummary[];
}

export function getKoperasiList(pageSize = 20): Promise<KoperasiListResponse> {
  return apiGet<KoperasiListResponse>(`/koperasi?pageSize=${pageSize}`);
}
