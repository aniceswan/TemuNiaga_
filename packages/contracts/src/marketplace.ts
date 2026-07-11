export interface ProdukSummary {
  produkSampleId: string;
  koperasiRef: string;
  namaKoperasi: string;
  namaProduk: string | null;
  unit: string | null;
  hargaJual: string; // Decimal serialized as string over the wire
  stok: number;
}

export interface ProdukListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: ProdukSummary[];
}

export interface CartItemInput {
  produkSampleId: string;
  jumlah: number;
}

export interface CreatePesananPayload {
  namaPembeli: string;
  teleponPembeli: string;
  alamatPembeli: string;
  items: CartItemInput[];
}

export interface PesananCreated {
  pesananRef: string;
  koperasiRef: string;
  namaKoperasi: string;
  totalHarga: string;
  status: string;
}

export interface CreatePesananResponse {
  pesanan: PesananCreated[];
}

export interface PesananItemSummary {
  namaProduk: string;
  hargaSatuan: string;
  jumlah: number;
  subtotal: string;
}

export interface PesananSummary {
  pesananRef: string;
  koperasiRef: string;
  namaPembeli: string;
  teleponPembeli: string;
  alamatPembeli: string;
  totalHarga: string;
  status: string;
  dibuatPada: string;
  items: PesananItemSummary[];
}

export interface PesananListResponse {
  total: number;
  items: PesananSummary[];
}
