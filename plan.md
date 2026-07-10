# FINAL SOFTWARE PLAN — TEMUNIAGA

## 0. Keputusan Utama

TemuNiaga dibangun sebagai **platform perdagangan koperasi end-to-end**, bukan sekadar marketplace dan bukan sekadar chatbot WhatsApp.

Produk akhir terdiri dari:

```text
TEMUNIAGA
│
├── 1. WhatsApp Assistant
│   Kanal petani dan anggota koperasi
│
├── 2. Dashboard Kopdes
│   Operasional pasokan, stok, transaksi, logistik, dan anggota
│
├── 3. Buyer Portal
│   RFQ, pengadaan, kontrak, pengiriman, dan pembayaran
│
├── 4. Public Marketplace
│   Produk UMKM dan informasi komoditas
│
├── 5. Admin & Pendamping Portal
│   Monitoring, verifikasi, readiness, audit, dan dampak
│
├── 6. TemuNiaga Core Backend
│   Aturan bisnis dan sumber kebenaran transaksi
│
├── 7. AI & Knowledge Layer
│   STT, Gemini, RAG, bahasa alami, dan TTS
│
└── 8. Integration Layer
    BPS, harga pangan, logistik, pembayaran, tanda tangan, dan WhatsApp
```

## Prinsip final

```text
WhatsApp memudahkan akses.
Gemini memahami bahasa.
RAG menyediakan pengetahuan.
Backend menjalankan aturan.
Database menyimpan fakta.
Operator memverifikasi kondisi lapangan.
Manusia menyetujui transaksi.
```

LLM tidak boleh menjadi sumber kebenaran untuk:

- stok;
- harga final;
- pembayaran;
- kontrak;
- kualitas;
- settlement;
- simpanan;
- SHU;
- keputusan pembiayaan.

---

# 1. Target Pengguna

## 1.1 Petani dan anggota koperasi

Menggunakan:

- WhatsApp teks;
- voice note;
- tombol atau daftar;
- bantuan operator.

Tidak diwajibkan membuka dashboard.

## 1.2 Operator Kopdes

Menggunakan dashboard web untuk:

- memverifikasi anggota;
- memverifikasi pasokan;
- mencatat kualitas;
- mengelola stok;
- merespons RFQ;
- mengatur pengumpulan;
- mengelola transaksi.

## 1.3 Pengurus Kopdes

Menggunakan dashboard untuk:

- persetujuan transaksi;
- pengawasan biaya;
- modal kerja;
- laporan;
- RAT;
- SHU;
- audit.

## 1.4 Buyer industri

Menggunakan Buyer Portal untuk:

- mencari pasokan;
- membuat RFQ;
- meminta sampel;
- melakukan negosiasi;
- menandatangani kontrak;
- memantau pengiriman;
- membayar invoice.

## 1.5 UMKM desa

Menggunakan dashboard ringan untuk:

- mengelola produk;
- stok;
- pesanan;
- penyerapan;
- pembayaran.

## 1.6 Admin dan pendamping

Menggunakan Admin Portal untuk:

- verifikasi Kopdes;
- memantau kesiapan;
- mendampingi operator;
- memeriksa anomali;
- melihat KPI;
- mengelola sengketa.

---

# 2. Model Bisnis Final

## 2.1 Hubungan bisnis

```text
Petani → anggota dan pemasok Kopdes
Kopdes → pelanggan utama software
Buyer → pengguna B2B dan pembeli komoditas
UMKM → pemasok produk marketplace
TemuNiaga → penyedia platform dan orkestrasi
```

## 2.2 Bentuk bisnis

```text
B2B SaaS
→ dashboard operasional untuk Kopdes.

B2B Marketplace
→ transaksi Kopdes dengan industri.

B2B2C Marketplace
→ penjualan produk UMKM ke konsumen.

Member Service
→ layanan koperasi untuk anggotanya.
```

## 2.3 Pendapatan TemuNiaga

### Tahap awal

Pembiayaan implementasi berasal dari:

- program pemerintah;
- CSR;
- bank;
- mitra pembiayaan;
- federasi koperasi;
- pemerintah daerah.

Alasannya sederhana: Kopdes yang belum memiliki transaksi tidak logis langsung dibebani biaya SaaS. Menagih pihak yang belum menghasilkan pendapatan merupakan cara yang cukup kreatif untuk kehilangan pelanggan.

### Setelah transaksi berjalan

```text
1. Subscription Kopdes
   Biaya dashboard, WhatsApp, laporan, dan dukungan.

2. Success fee
   Persentase kecil dari transaksi berhasil.

3. Logistics orchestration fee
   Biaya pencarian quotation, koordinasi, dan rekonsiliasi.

4. Marketplace commission
   Komisi produk UMKM.

5. Buyer premium service
   Supplier discovery, analytics, dan procurement management.

6. Implementation and training fee
   Onboarding, pelatihan, dan migrasi data.
```

## 2.4 Prinsip biaya

- Tidak ada potongan tersembunyi.
- Seluruh biaya ditampilkan sebelum persetujuan.
- Petani tidak membayar biaya akses WhatsApp.
- Fee TemuNiaga tidak boleh mengurangi hak anggota tanpa persetujuan.
- Semua biaya dapat diaudit.

---

# 3. Ruang Lingkup Produk

## 3.1 Produk inti

```text
A. Agricultural Supply Network
   Komoditas → RFQ → pooling → industri

B. Cooperative Operating System
   Anggota → pasokan → stok → transaksi → settlement → SHU

C. Village Product Marketplace
   UMKM → katalog → order → pembayaran → pengiriman

D. Conversational Access Layer
   WhatsApp teks dan voice note
```

## 3.2 Prioritas pengembangan

```text
Prioritas 1:
Komoditas dan transaksi B2B.

Prioritas 2:
Fungsi operasional koperasi.

Prioritas 3:
Marketplace produk UMKM.

Prioritas 4:
Pembiayaan dan model penyerapan berisiko tinggi.
```

---

# 4. Arsitektur Software Final

```text
┌────────────────────────────────────────────────────┐
│                    CHANNEL LAYER                   │
│ WhatsApp | Public Web | Kopdes | Buyer | Admin    │
└─────────────────────────┬──────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────┐
│              API GATEWAY & AUTHENTICATION          │
│ JWT | RBAC | Session | Rate Limit | Audit Context │
└─────────────────────────┬──────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────┐
│                TEMUNIAGA CORE BACKEND              │
│ Member | Supply | Inventory | RFQ | Pooling       │
│ Quality | Logistics | Contract | Payment          │
│ Settlement | RAT | SHU | Complaint                │
└───────────────┬───────────────────────┬────────────┘
                │                       │
┌───────────────▼────────────┐ ┌────────▼────────────┐
│ AI & CONVERSATION LAYER    │ │ INTEGRATION LAYER  │
│ STT | Gemini | RAG | TTS   │ │ BPS | WA | Maps    │
│ Intent | Function Calling  │ │ Payment | Logistics│
└───────────────┬────────────┘ └────────┬────────────┘
                │                       │
┌───────────────▼───────────────────────▼────────────┐
│                     DATA LAYER                     │
│ PostgreSQL | pgvector | Redis | Object Storage    │
└────────────────────────────────────────────────────┘
```

---

# 5. Tech Stack Final

## 5.1 Frontend

```yaml
framework: Next.js
language: TypeScript
ui: Tailwind CSS
components: shadcn/ui
form: React Hook Form
validation: Zod
state:
  server: TanStack Query
  local: Zustand
charts: Recharts
maps: MapLibre atau Google Maps
```

Aplikasi web dibuat responsif agar dapat dipakai melalui laptop murah dan ponsel Android.

## 5.2 Backend utama

```yaml
framework: NestJS
language: TypeScript
architecture: modular_monolith
api:
  - REST
  - WebSocket untuk notifikasi
validation: Zod atau class-validator
orm: Prisma
```

### Alasan modular monolith

- lebih cepat dibangun;
- deployment lebih sederhana;
- transaksi database lebih mudah;
- cukup untuk pilot dan skala awal;
- dapat dipisah menjadi microservice jika trafik sudah membenarkan kerumitan tersebut.

Microservice tidak digunakan sejak awal. Belum ada gunanya menciptakan 18 service untuk melayani 300 pengguna selain memberi pekerjaan tambahan kepada manusia yang sudah kekurangan waktu.

## 5.3 AI service

```yaml
framework: FastAPI
language: Python

stt:
  engine: faster-whisper
  model_default: small
  execution: lokal

llm:
  provider: Gemini
  model: configurable
  functions:
    - intent_classification
    - entity_extraction
    - natural_response
    - document_answering

tts:
  primary: Gemini TTS
  fallback: Piper
  emergency_fallback: espeak-ng

rag:
  embedding: configurable
  storage: PostgreSQL pgvector
```

## 5.4 Database dan infrastruktur

```yaml
database: PostgreSQL
vector_database: pgvector
cache_and_session: Redis
job_queue: BullMQ
object_storage:
  local: MinIO
  production: S3-compatible storage
reverse_proxy: Nginx
container: Docker
deployment_mvp: Docker Compose
deployment_scale: managed container atau Kubernetes bila diperlukan
monitoring:
  - OpenTelemetry
  - Prometheus
  - Grafana
error_tracking: Sentry
```

---

# 6. Struktur Repository

```text
temuniaga/
│
├── apps/
│   ├── public-web/
│   ├── koperasi-dashboard/
│   ├── buyer-portal/
│   ├── admin-portal/
│   ├── api/
│   ├── whatsapp-worker/
│   └── ai-service/
│
├── packages/
│   ├── ui/
│   ├── database/
│   ├── auth/
│   ├── contracts/
│   ├── validation/
│   ├── pricing-engine/
│   ├── unit-conversion/
│   └── shared-types/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   ├── monitoring/
│   └── deployment/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── legal/
│   ├── business-rules/
│   └── sop/
│
└── tests/
    ├── integration/
    ├── end-to-end/
    └── load/
```

---

# 7. Public Website

## Tujuan

- menjelaskan TemuNiaga;
- memperlihatkan jaringan Kopdes;
- menampilkan komoditas agregat;
- menyediakan marketplace UMKM;
- membangun kepercayaan.

## Halaman

```text
/
├── tentang
├── cara-kerja
├── koperasi
├── komoditas
├── produk-desa
├── harga-referensi
├── transparansi
├── bantuan
├── faq
└── masuk
```

## Fitur

- pencarian Kopdes;
- katalog produk UMKM;
- informasi komoditas tanpa membuka data pribadi petani;
- rentang harga referensi;
- metodologi harga;
- cerita dampak;
- pusat bantuan;
- pendaftaran buyer;
- pendaftaran Kopdes.

---

# 8. Dashboard Kopdes

## 8.1 Beranda

Menampilkan:

- anggota aktif;
- pasokan tersedia;
- transaksi aktif;
- RFQ baru;
- status pengiriman;
- pembayaran tertunda;
- masalah yang harus diselesaikan;
- readiness score.

## 8.2 Anggota

- daftar anggota;
- verifikasi identitas;
- nomor WhatsApp;
- status aktif;
- simpanan;
- transaksi;
- kontribusi;
- hak akses;
- consent data.

## 8.3 Pasokan

- laporan dari WhatsApp;
- input manual operator;
- verifikasi;
- penjadwalan panen;
- lokasi;
- jumlah;
- satuan;
- metode penyerapan;
- status.

## 8.4 Quality Control

- template berdasarkan komoditas;
- pencatatan grade;
- kadar air;
- defect;
- berat;
- hasil sampling;
- verifier;
- bukti pengujian;
- status lolos atau ditolak.

## 8.5 Inventory

- stok per lot;
- pemilik lot;
- gudang;
- umur stok;
- kondisi;
- reserved stock;
- available stock;
- outgoing stock;
- kerusakan;
- penyusutan.

## 8.6 Harga

- harga BPS;
- harga buyer;
- transaksi historis;
- estimasi netback;
- biaya logistik;
- biaya handling;
- kekuatan data;
- waktu pembaruan.

## 8.7 RFQ dan Penawaran

- RFQ masuk;
- syarat buyer;
- jumlah;
- MOQ;
- spesifikasi;
- tanggal;
- quotation;
- negosiasi;
- status persetujuan anggota.

## 8.8 Pooling

- kebutuhan buyer;
- stok Kopdes sendiri;
- stok Kopdes lain;
- alokasi volume;
- lead operasional;
- legal seller;
- kualitas;
- pengiriman;
- kontribusi.

## 8.9 Logistik

- penjemputan petani;
- pengelompokan rute;
- quotation;
- kendaraan;
- jadwal;
- status;
- proof of delivery;
- biaya aktual;
- klaim.

## 8.10 Transaksi

- quotation;
- kontrak;
- purchase order;
- surat jalan;
- invoice;
- pembayaran;
- settlement;
- sengketa.

## 8.11 Fungsi koperasi

- simpanan pokok;
- simpanan wajib;
- transaksi anggota;
- RAT;
- kontribusi SHU;
- laporan anggota;
- pelatihan;
- pengaduan.

---

# 9. Buyer Portal

## Fitur utama

```text
Buyer Portal
│
├── Registrasi dan KYB
├── Pencarian komoditas
├── RFQ
├── Supplier discovery
├── Pooling visibility
├── Sample request
├── Quotation
├── Negosiasi
├── Kontrak
├── Purchase order
├── Pengiriman
├── Quality claim
├── Invoice
├── Pembayaran
└── Riwayat dan supplier score
```

## Buyer tidak melihat

- data pribadi petani;
- saldo simpanan;
- transaksi anggota lain;
- data internal koperasi;
- informasi yang tidak relevan dengan pengadaan.

## Supplier score

Dihitung dari:

- ketepatan volume;
- ketepatan waktu;
- kualitas;
- cancellation rate;
- dispute rate;
- repeat order;
- ketepatan dokumen.

Skor tidak boleh dibuat hanya oleh AI. Skor berasal dari data transaksi.

---

# 10. Admin dan Pendamping Portal

## Fitur

- verifikasi Kopdes;
- verifikasi buyer;
- monitoring operator;
- kualitas data;
- missing data;
- anomali transaksi;
- readiness Kopdes;
- fasilitas;
- aktivitas WhatsApp;
- tingkat handoff;
- insiden AI;
- volume transaksi;
- farmer benefit;
- ROI;
- sengketa;
- audit log.

## Readiness categories

```text
Kurang Siap
→ belum memenuhi persyaratan transaksi.

Menengah
→ dapat menjalankan buyer-first terbatas.

Siap
→ dapat melakukan pooling dan transaksi B2B.

Lead-ready
→ dapat menjadi koordinator atau legal seller.
```

---

# 11. WhatsApp Assistant

## 11.1 Kanal yang didukung

- pesan teks;
- voice note;
- tombol;
- list;
- gambar;
- dokumen;
- lokasi;
- operator manusia.

## 11.2 Mode balasan

```text
text
voice
text_and_voice
follow_input_mode
```

Untuk harga, jumlah, kontrak, dan pembayaran:

```text
Selalu sertakan ringkasan teks.
```

---

# 12. Alur Teknis WhatsApp

## 12.1 Pesan teks

```text
WhatsApp message
        ↓
Baileys Adapter / Cloud API Adapter
        ↓
Identity Resolver
        ↓
Conversation Session
        ↓
Language Detector
        ↓
Text and Unit Normalizer
        ↓
Intent + Entity Extraction
        ↓
Policy Engine
        ↓
Tool Router
        ↓
Backend Service / RAG / API
        ↓
Response Generator
        ↓
WhatsApp message
```

## 12.2 Voice note

```text
WhatsApp Voice Note
        ↓
Media download
        ↓
FFmpeg normalization
OGG/Opus → WAV mono 16 kHz
        ↓
faster-whisper lokal
        ↓
Transkrip
        ↓
Language and Unit Normalizer
        ↓
Intent + Entity Extraction
        ↓
Policy Engine
        ↓
Tool Router
        ↓
Backend Service / RAG / API
        ↓
Response Generator
        ↓
Gemini TTS atau Piper
        ↓
FFmpeg
PCM/WAV → OGG/Opus
        ↓
Voice note + ringkasan teks
```

## 12.3 Keputusan integrasi

```text
Prototype:
Baileys.

Produksi:
WhatsApp Cloud API.

Backend:
Menggunakan adapter agar tidak terkunci pada Baileys.
```

---

# 13. Fitur WhatsApp Final

## 13.1 Percakapan umum

- menyapa;
- menjawab salam;
- menjelaskan cara penggunaan;
- mengulang jawaban;
- mengganti bahasa;
- berbicara dengan operator.

## 13.2 Keanggotaan

- cek status anggota;
- pendaftaran;
- kartu anggota;
- hak dan kewajiban;
- perubahan data;
- status verifikasi.

## 13.3 Simpanan

- simpanan pokok;
- simpanan wajib;
- riwayat;
- pengingat;
- status pembayaran.

## 13.4 Pasokan

- lapor hasil;
- ubah laporan;
- batalkan;
- jumlah;
- satuan;
- lokasi;
- waktu panen;
- waktu tersedia;
- metode penyerapan;
- status verifikasi.

## 13.5 Harga

- cek rentang harga;
- sumber harga;
- waktu pembaruan;
- penawaran buyer;
- estimasi biaya;
- estimasi hasil bersih;
- alasan potongan.

## 13.6 Transaksi

- menerima penawaran;
- meminta penjelasan;
- menyetujui;
- menolak;
- status pooling;
- jadwal pickup;
- status pengiriman;
- status pembayaran;
- rincian settlement.

## 13.7 Fungsi koperasi

- informasi RAT;
- pengingat RAT;
- transaksi anggota;
- kontribusi SHU;
- pelatihan;
- pembelian sarana bersama;
- pengaduan.

---

# 14. Conversational UX

## Respons sapaan

```text
Pengguna:
"Halo."

Sistem:
"Halo, Pak/Bu. Mau cek harga, lapor hasil panen,
atau melihat pembayaran?"
```

```text
Pengguna:
"Assalamualaikum."

Sistem:
"Waalaikumsalam. Ada yang bisa saya bantu?"
```

## Respons tidak jelas

```text
Pengguna:
"Yang kemarin bagaimana?"

Sistem:
"Bapak sedang menanyakan laporan kopi 200 kilo
atau pembayaran transaksi sebelumnya?"
```

## Koreksi

```text
Pengguna:
"Bukan 300 kilo, 200 kilo."

Sistem:
"Baik, saya ubah sementara menjadi 200 kilo.
Apakah sudah benar?"
```

## Human handoff

Sistem menyerahkan kepada operator jika:

- tiga kali gagal memahami;
- terjadi sengketa;
- perubahan rekening;
- talangan;
- pembatalan transaksi besar;
- kualitas dipermasalahkan;
- pengguna meminta operator.

---

# 15. Bahasa dan Normalisasi

## Bahasa

```text
Fase 1:
Bahasa Indonesia.

Fase 2:
Bahasa Indonesia + istilah lokal.

Fase 3:
Bahasa Sunda dan Jawa pada lokasi pilot.

Fase 4:
Bahasa lain berdasarkan kebutuhan.
```

## Data internal

```json
{
  "quantity": 200,
  "unit": "kg"
}
```

## Penyajian

```text
WhatsApp teks:
200 kg

Voice note:
dua ratus kilo

Kontrak:
200 kilogram
```

## Kamus lokal

```yaml
sampeu: singkong
pare: padi
sakintal: 100 kg
dua kuintal: 200 kg
gabah garing: gabah kering
```

---

# 16. AI, RAG, dan Anti-Halusinasi

## 16.1 RAG digunakan untuk

- SOP;
- metode penyerapan;
- hak anggota;
- aturan koperasi;
- panduan RAT;
- penjelasan SHU;
- FAQ;
- panduan kualitas;
- template legal;
- panduan operator.

## 16.2 Database digunakan untuk

- stok;
- harga buyer;
- pembayaran;
- kontrak;
- simpanan;
- pengiriman;
- settlement;
- data anggota;
- status transaksi.

## 16.3 Tool routing

```text
Pertanyaan aturan
→ RAG

Pertanyaan harga
→ Pricing Service

Pertanyaan stok
→ Inventory Service

Pertanyaan pembayaran
→ Payment Service

Pertanyaan pengiriman
→ Logistics Service

Tindakan transaksi
→ Business Service + confirmation
```

## 16.4 Aturan anti-halusinasi

1. LLM tidak menulis langsung ke database.
2. Semua angka operasional berasal dari backend.
3. Jawaban faktual menyimpan sumber.
4. Harga menyertakan waktu pembaruan.
5. Data kosong tidak boleh diisi tebakan.
6. Tindakan sensitif harus dikonfirmasi.
7. Tool call disimpan dalam audit log.
8. Pengguna dapat meminta operator.
9. Hak akses diperiksa sebelum query.
10. Riwayat percakapan tidak dianggap sumber transaksi.

---

# 17. Empat Metode Penyerapan

## 17.1 Buyer-first

```text
Buyer membuat RFQ
        ↓
Sistem mencari pasokan
        ↓
Petani menyetujui
        ↓
Barang dikumpulkan
        ↓
Dikirim
        ↓
Dibayar
```

Status:

```text
Metode utama MVP.
```

## 17.2 Titip jual

```text
Petani menitipkan barang
        ↓
Kopdes menyimpan
        ↓
Kopdes mencari buyer
        ↓
Petani dibayar setelah terjual
```

Status:

```text
Masuk fase setelah inventory dan gudang siap.
```

## 17.3 Talangan

```text
Barang diverifikasi
        ↓
Petani menerima dana awal
        ↓
Barang dijual
        ↓
Talangan direkonsiliasi
```

Status:

```text
Tidak masuk MVP penuh.
Hanya dapat dilakukan melalui mitra pembiayaan resmi.
```

## 17.4 Beli putus

```text
Kopdes membeli barang
        ↓
Risiko berpindah ke Kopdes
        ↓
Kopdes menyimpan dan menjual
```

Status:

```text
Ditunda sampai data permintaan, gudang,
modal, dan risk management tersedia.
```

---

# 18. Price Intelligence

## Sumber data

```text
BPS
+ Panel Harga Pangan
+ data pasar daerah
+ RFQ buyer
+ transaksi TemuNiaga
+ input operator terverifikasi
+ quotation logistik
```

## Pipeline

```text
Data ingestion
        ↓
Normalisasi komoditas
        ↓
Normalisasi satuan
        ↓
Normalisasi wilayah
        ↓
Pembersihan outlier
        ↓
Pemisahan grade
        ↓
Perhitungan rentang
        ↓
Netback calculation
```

## Output

```yaml
commodity: kopi
region: Kabupaten X
grade: B
volume: 5000
unit: kg

reference_range:
  min: 29000
  median: 30500
  max: 32000

active_buyer_offer: 31500

estimated_costs:
  collection: 250
  grading: 100
  packaging: 75
  transport: 450
  cooperative_service: 200
  platform: 60

estimated_farmer_receipt: 30365

sources:
  - BPS
  - active_rfq
  - verified_transactions
  - logistics_quote

updated_at:
data_strength: strong
```

## Data strength

```text
Strong:
wilayah, grade, waktu, dan volume sebanding.

Medium:
sebagian parameter tidak sama.

Weak:
hanya memakai data regional lama.
```

TemuNiaga tidak mengklaim harga real-time jika sumbernya bulanan.

---

# 19. Farmer Benefit

## 19.1 Product Farmer Share

```text
Penerimaan bersih petani
÷
nilai produk buyer
× 100%
```

## 19.2 Landed-Cost Farmer Share

```text
Penerimaan bersih petani
÷
total biaya buyer sampai barang diterima
× 100%
```

## 19.3 Member Economic Benefit

```text
Penerimaan bersih petani
+ SHU yang dapat diatribusikan
+ manfaat ekonomi anggota
```

## Rincian biaya wajib

- pengumpulan;
- timbang;
- grading;
- kemasan;
- gudang;
- penyusutan;
- transportasi;
- asuransi;
- administrasi;
- platform;
- jasa Kopdes;
- pembiayaan;
- pajak.

Semua biaya ditampilkan per transaksi dan, jika memungkinkan, per kilogram.

---

# 20. Quality Management

## Schema umum

```yaml
quality_record:
  lot_id:
  commodity_id:
  variety:
  grade:
  moisture:
  defect:
  harvest_date:
  packaging:
  sample_id:
  test_method:
  tested_by:
  tested_at:
  verification_status:
  buyer_spec_match:
```

## Template per komoditas

```text
Kopi:
grade, kadar air, defect, varietas.

Gabah:
kadar air, kadar hampa, kotoran, varietas.

Telur:
berat, ukuran, retak, kebersihan.

Sayuran:
ukuran, kesegaran, kerusakan, umur panen.
```

## Foto

```text
Komoditas:
opsional sebagai bukti pendukung.

Produk UMKM:
wajib untuk katalog.

Pengiriman:
wajib pada pickup, loading, delivery, dan claim.
```

Foto tidak dianggap pengganti pengujian kualitas.

---

# 21. Logistik

## 21.1 First mile

```text
Petani → titik kumpul
```

Fitur:

- lokasi petani;
- jadwal pickup;
- pengelompokan rute;
- kendaraan lokal;
- biaya bahan bakar;
- biaya tenaga;
- bongkar-muat;
- berat aktual.

## 21.2 Konsolidasi

```text
Titik kumpul → gudang/hub
```

Fitur:

- timbang;
- lot;
- grading;
- kemasan;
- penyimpanan;
- traceability;
- inventory.

## 21.3 Line haul

```text
Gudang/hub → buyer
```

Fitur:

- request quotation;
- compare provider;
- jenis kendaraan;
- kapasitas;
- jadwal;
- tracking;
- proof of delivery;
- invoice;
- claim;
- reconciliation.

## Sumber harga logistik

```text
1. Quotation aktual.
2. Tarif kontrak.
3. Riwayat pengiriman.
4. Agregator kurir untuk UMKM.
5. Estimasi berbasis jarak sebagai fallback.
```

## Pembagian biaya

```text
weight_based
volume_based
lot_based
fixed_plus_variable
```

Metode pembagian harus disepakati sebelum transaksi.

---

# 22. Pooling Lintas-Kopdes

## Matching criteria

- komoditas;
- varietas;
- grade;
- jumlah;
- lokasi;
- waktu tersedia;
- kualitas;
- persetujuan;
- fasilitas;
- riwayat;
- biaya logistik.

## Model MVP

```text
Buyer
├── PO ke Kopdes A
├── PO ke Kopdes B
└── PO ke Kopdes C

TemuNiaga:
- mengoordinasikan pooling;
- mengatur jadwal;
- menampilkan satu dashboard;
- mencatat alokasi.
```

Alasan:

- tanggung jawab legal lebih jelas;
- lead tidak menanggung seluruh risiko;
- lebih mudah untuk pilot.

## Model lanjutan

```text
Buyer
    ↓ satu kontrak
Lead Kopdes / koperasi sekunder
    ↓ perjanjian pasokan
Supporting Kopdes
    ↓
Petani
```

## Lead Kopdes

Dipilih berdasarkan:

- legalitas;
- rekening;
- operator;
- pengalaman;
- fasilitas;
- administrasi;
- kualitas;
- ketepatan pengiriman;
- kemampuan settlement.

Lead memperoleh coordination fee yang transparan.

---

# 23. Alur Transaksi B2B

```text
Buyer verification
        ↓
RFQ
        ↓
Matching
        ↓
Pooling
        ↓
Supply reservation
        ↓
Sampling
        ↓
Quality verification
        ↓
Quotation
        ↓
Negotiation
        ↓
Farmer approval
        ↓
Contract
        ↓
Purchase order
        ↓
Pickup
        ↓
Shipment
        ↓
Buyer acceptance
        ↓
Quality claim window
        ↓
Invoice
        ↓
Payment
        ↓
Settlement
        ↓
Farmer payout
        ↓
Ledger
        ↓
SHU contribution
```

## Dokumen

- RFQ;
- quotation;
- kontrak;
- PO;
- perjanjian pasokan;
- surat jalan;
- tiket timbang;
- hasil QC;
- proof of delivery;
- invoice;
- bukti pembayaran;
- settlement statement;
- berita acara klaim.

---

# 24. Status Lifecycle

## Supply lot

```text
DRAFT
→ SUBMITTED
→ VERIFIED
→ AVAILABLE
→ RESERVED
→ ALLOCATED
→ COLLECTED
→ QC_PASSED
→ SHIPPED
→ DELIVERED
→ SETTLED
```

Status alternatif:

```text
REJECTED
CANCELLED
DAMAGED
EXPIRED
```

## RFQ

```text
DRAFT
→ PUBLISHED
→ MATCHING
→ QUOTED
→ NEGOTIATING
→ ACCEPTED
→ CONTRACTED
→ FULFILLED
→ CLOSED
```

## Payment

```text
PENDING
→ INVOICED
→ PARTIALLY_PAID
→ PAID
→ RECONCILED
→ SETTLED
```

## Complaint

```text
OPEN
→ INVESTIGATING
→ RESOLVED
→ REJECTED
→ ESCALATED
```

---

# 25. Data Model Utama

```text
User
Member
Cooperative
CooperativeRole
Facility
SavingsAccount

Commodity
CommodityQualitySchema
Product
SupplyLot
QualityRecord
InventoryLot

Buyer
RFQ
RFQItem
Offer
Pool
PoolAllocation

Contract
PurchaseOrder
Shipment
ShipmentLot
LogisticsQuote
QualityInspection

Invoice
Payment
Settlement
SettlementLine

RAT
SHUContribution
Complaint
AuditEvent

ConversationSession
Message
ToolCall
DocumentSource
EmbeddingChunk
```

---

# 26. Security dan Governance

## Wajib

- role-based access control;
- audit log;
- encryption in transit;
- encryption untuk data sensitif;
- consent;
- session timeout;
- rate limiting;
- backup;
- disaster recovery;
- least privilege;
- secret management;
- immutable transaction log.

## Data sensitif

- NIK;
- nomor telepon;
- rekening;
- alamat;
- voice note;
- data transaksi;
- dokumen legal.

## Voice note

```text
Default:
dihapus setelah transkripsi.

Opsional:
disimpan untuk sengketa atau peningkatan model
hanya dengan dasar dan persetujuan yang jelas.
```

## Tindakan berisiko tinggi

Memerlukan:

- re-authentication;
- kode konfirmasi;
- approval pengurus;
- audit log;
- operator review.

Contoh:

- perubahan rekening;
- persetujuan kontrak;
- pembatalan;
- talangan;
- settlement;
- perubahan nilai transaksi.

---

# 27. Marketplace UMKM

## Status

```text
Bukan fokus MVP pertama.
Masuk setelah transaksi komoditas berjalan.
```

## Fitur

- profil UMKM;
- katalog;
- foto;
- varian;
- stok;
- harga;
- sertifikasi;
- keranjang;
- checkout;
- pembayaran;
- kurir;
- tracking;
- retur;
- ulasan.

## Model penyerapan

```text
Pre-order / buyer-first
Titip jual
Beli grosir
Pembiayaan berbasis PO
```

---

# 28. MVP Final

## Masuk MVP

```text
1. Satu wilayah pilot.
2. Satu komoditas.
3. Lima sampai sepuluh Kopdes.
4. Seratus sampai tiga ratus petani.
5. Satu sampai tiga buyer.
6. WhatsApp teks.
7. WhatsApp voice note.
8. Laporan pasokan.
9. Verifikasi operator.
10. Data kualitas dasar.
11. Informasi harga.
12. Estimasi netback.
13. Buyer RFQ.
14. Matching.
15. Pooling.
16. Buyer-first.
17. Persetujuan petani.
18. Quotation logistik manual.
19. Pengiriman.
20. Invoice.
21. Settlement transparan.
22. Dashboard Kopdes.
23. Buyer Portal sederhana.
24. Admin Portal.
25. RAG untuk SOP.
26. Audit log.
```

## Ditunda

```text
1. Talangan penuh.
2. Beli putus skala besar.
3. Escrow internal.
4. Marketplace UMKM lengkap.
5. Semua komoditas.
6. Semua bahasa daerah.
7. Grading otomatis AI.
8. Optimasi rute kompleks.
9. Prediksi harga otomatis.
10. Ekspor.
```

---

# 29. Roadmap Implementasi

## Fase 0 — Discovery dan validasi

Durasi: 3–4 minggu

Deliverable:

- komoditas pilot;
- wilayah;
- buyer commitment;
- flow bisnis;
- biaya awal;
- legal review;
- baseline data;
- SOP lapangan.

Exit criteria:

```text
Minimal satu buyer menyatakan kebutuhan nyata.
Minimal lima Kopdes siap berpartisipasi.
Parameter kualitas dan MOQ diketahui.
```

---

## Fase 1 — Fondasi teknis

Durasi: 4 minggu

Deliverable:

- monorepo;
- authentication;
- RBAC;
- PostgreSQL;
- master data;
- audit log;
- Docker;
- CI/CD.

---

## Fase 2 — Dashboard Kopdes dan pasokan

Durasi: 5–6 minggu

Deliverable:

- anggota;
- pasokan;
- inventory;
- quality record;
- fasilitas;
- operator workflow.

---

## Fase 3 — WhatsApp

Durasi: 4–5 minggu

Deliverable:

- pesan teks;
- voice note;
- STT;
- intent;
- entity extraction;
- confirmation;
- human handoff;
- TTS;
- session state.

---

## Fase 4 — Harga dan buyer portal

Durasi: 5 minggu

Deliverable:

- BPS adapter;
- price normalization;
- netback;
- buyer registration;
- RFQ;
- quotation.

---

## Fase 5 — Pooling dan logistik

Durasi: 5–6 minggu

Deliverable:

- matching;
- pooling;
- allocation;
- quotation logistik;
- pickup;
- shipment;
- proof of delivery.

---

## Fase 6 — Kontrak dan settlement

Durasi: 5–6 minggu

Deliverable:

- kontrak;
- PO;
- invoice;
- payment status;
- settlement;
- member payout;
- ledger.

---

## Fase 7 — Pilot

Durasi: 6 bulan

Aktivitas:

- onboarding;
- pelatihan;
- transaksi nyata;
- monitoring;
- dukungan operator;
- evaluasi KPI;
- pengukuran ROI.

---

## Fase 8 — Scale

Setelah pilot lolos:

- WhatsApp Cloud API;
- bahasa daerah;
- konsinyasi;
- mitra pembiayaan;
- lead Kopdes;
- marketplace UMKM;
- multi-region;
- advanced analytics.

---

# 30. Tim Minimum

```text
1 Product Lead
1 Business/Supply Chain Analyst
1 UX Researcher
1 UI/UX Designer
2 Full-stack Engineer
1 Backend Engineer
1 AI/Python Engineer
1 Data Engineer part-time
1 QA Engineer
1 DevOps part-time
1 Legal/Compliance Advisor
2 Field Operations/Trainer
```

MVP tidak cukup dibangun hanya oleh programmer. Masalah terbesar kemungkinan bukan tombol yang salah warna, tetapi barang tidak tersedia, operator tidak aktif, dan buyer tidak mau menandatangani kontrak.

---

# 31. Testing

## Software testing

- unit test;
- integration test;
- end-to-end test;
- role access test;
- load test;
- security test;
- backup recovery test.

## AI testing

- intent accuracy;
- entity extraction;
- angka;
- satuan;
- bahasa lokal;
- kebisingan;
- hallucination;
- tool routing;
- confirmation.

## Field testing

- pengguna yang jarang mengetik;
- voice note bising;
- internet lemah;
- operator lambat;
- perubahan harga;
- barang tidak sesuai;
- buyer membatalkan;
- pengiriman terlambat.

---

# 32. KPI Pilot

## Aktivasi

- anggota terverifikasi;
- pengguna WhatsApp aktif;
- operator aktif;
- pasokan terverifikasi.

## Transaksi

- volume;
- nilai;
- jumlah RFQ;
- RFQ conversion;
- MOQ fulfillment;
- repeat order.

## Petani

- penerimaan bersih;
- waktu pembayaran;
- biaya penjualan;
- farmer’s share;
- partisipasi;
- keluhan.

## Kopdes

- pendapatan;
- biaya operasional;
- margin;
- transaksi per bulan;
- anggota aktif.

## Buyer

- fill rate;
- on-time delivery;
- rejection;
- sourcing time;
- repeat purchase.

## Sistem

- response time;
- intent accuracy;
- STT correction rate;
- handoff rate;
- hallucination incident;
- cost per interaction;
- uptime.

---

# 33. ROI

## Petani

```text
Manfaat tambahan
=
penerimaan bersih TemuNiaga
-
penerimaan bersih saluran lama
```

## Kopdes

```text
Manfaat bersih
=
jasa Kopdes
+ coordination fee
+ komisi
+ layanan logistik
-
operator
-
gudang
-
QC
-
teknologi
-
kerusakan
-
modal
```

## Buyer

```text
Manfaat
=
penghematan sourcing
+ penurunan gagal pasok
+ penurunan waktu koordinasi
-
biaya platform
-
QC
-
logistik tambahan
```

## TemuNiaga

```text
Contribution margin
=
subscription
+ success fee
+ service fee
-
WhatsApp
-
Gemini
-
server
-
support
-
payment fee
-
dispute handling
```

## Break-even

```text
Break-even transaction value
=
fixed monthly cost
÷
effective fee percentage
```

ROI menggunakan skenario:

- konservatif;
- dasar;
- optimistis.

Angka final hanya diisi setelah diketahui:

- komoditas;
- lokasi;
- volume;
- jarak;
- buyer;
- biaya tenaga;
- fasilitas;
- biaya teknologi.

---

# 34. Go/No-Go Criteria

## Go

TemuNiaga dilanjutkan jika:

```text
- minimal satu buyer melakukan transaksi ulang;
- minimal 50% target volume berhasil dikumpulkan;
- pembayaran petani tidak lebih lambat dari saluran lama;
- penerimaan bersih petani tidak menurun;
- biaya operasional Kopdes dapat ditutup;
- rejection rate berada dalam batas buyer;
- operator dapat menjalankan sistem tanpa pendamping penuh.
```

## Pivot

Produk harus diubah jika:

```text
- petani aktif tetapi buyer tidak tersedia;
- pasokan tersedia tetapi kualitas tidak konsisten;
- pooling gagal karena koordinasi;
- WhatsApp digunakan tetapi transaksi tidak naik;
- biaya logistik menghapus keuntungan.
```

## No-Go

Pilot dihentikan jika:

```text
- tidak ada buyer nyata;
- biaya lebih besar daripada manfaat;
- Kopdes tidak memiliki operator;
- terjadi pelanggaran legal serius;
- pembayaran petani tidak aman;
- kualitas tidak dapat diverifikasi;
- konflik tata kelola tidak dapat diselesaikan.
```

---

# 35. Final Product Definition

```text
TemuNiaga adalah Cooperative Trade Operating System.

Petani berinteraksi melalui WhatsApp.
Operator mengelola pasokan melalui dashboard.
Buyer melakukan pengadaan melalui Buyer Portal.
Kopdes saling menggabungkan volume melalui pooling.
Harga dihitung dari sumber dan biaya yang transparan.
Kualitas diverifikasi per lot.
Logistik dicatat dari first mile sampai buyer.
Transaksi dikelola melalui RFQ, kontrak, PO, invoice,
pembayaran, settlement, dan audit.

AI mempermudah interaksi.
AI tidak mengendalikan uang atau transaksi.

Produk dibangun mulai dari buyer-first dan satu komoditas,
kemudian diperluas ke konsinyasi, pembiayaan,
beli putus, bahasa daerah, dan marketplace UMKM.
```