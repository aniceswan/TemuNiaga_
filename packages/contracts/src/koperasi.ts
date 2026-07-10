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

export interface AnggotaSummary {
  anggotaRef: string;
  koperasiRef: string;
  nama: string | null;
  statusKeanggotaan: string | null;
  pekerjaan: string | null;
}

export interface AnggotaListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: AnggotaSummary[];
}

export interface DashboardTotals {
  totalKoperasi: number;
  totalAnggota: number;
  totalSimpanan: string; // Decimal serialized as string over the wire
}
