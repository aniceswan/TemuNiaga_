-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN_PENDAMPING', 'PENGURUS_KOPERASI', 'OPERATOR_KOPERASI', 'BUYER', 'PUBLIC');

-- CreateTable
CREATE TABLE "referensi_wilayah" (
    "kode_wilayah" TEXT NOT NULL,
    "provinsi" TEXT,
    "kab_kota" TEXT,
    "kecamatan" TEXT,
    "desa_kelurahan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_wilayah_pkey" PRIMARY KEY ("kode_wilayah")
);

-- CreateTable
CREATE TABLE "referensi_profil_desa" (
    "kode_wilayah" TEXT NOT NULL,
    "tahun_populasi" INTEGER,
    "total_penduduk" INTEGER,
    "penduduk_laki_laki" INTEGER,
    "penduduk_perempuan" INTEGER,
    "tahun_pendanaan" INTEGER,
    "anggaran_dana_desa" DECIMAL(18,2),
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_profil_desa_pkey" PRIMARY KEY ("kode_wilayah")
);

-- CreateTable
CREATE TABLE "referensi_komoditas_desa" (
    "komoditas_ref" TEXT NOT NULL,
    "kode_wilayah" TEXT NOT NULL,
    "nama_komoditas" TEXT,
    "luas_area" TEXT,
    "volume" TEXT,
    "jumlah_sdm_terlibat" INTEGER,
    "nilai_potensi_desa" DECIMAL(18,2),
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_komoditas_desa_pkey" PRIMARY KEY ("komoditas_ref")
);

-- CreateTable
CREATE TABLE "referensi_dokumen_koperasi" (
    "jenis_dokumen_ref" TEXT NOT NULL,
    "nama_dokumen" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_dokumen_koperasi_pkey" PRIMARY KEY ("jenis_dokumen_ref")
);

-- CreateTable
CREATE TABLE "referensi_gerai_koperasi" (
    "jenis_gerai_ref" TEXT NOT NULL,
    "nama_jenis_gerai" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_gerai_koperasi_pkey" PRIMARY KEY ("jenis_gerai_ref")
);

-- CreateTable
CREATE TABLE "profil_koperasi" (
    "koperasi_ref" TEXT NOT NULL,
    "nama_koperasi" TEXT NOT NULL,
    "status_registrasi" TEXT,
    "bentuk_koperasi" TEXT,
    "kategori_usaha" TEXT,
    "nik_koperasi" TEXT,
    "alamat_lengkap" TEXT,
    "kode_pos" TEXT,
    "koordinat_dibulatkan" TEXT,
    "modal_awal" DECIMAL(18,2),
    "sumber_persetujuan" TEXT,
    "tentang_koperasi" TEXT,
    "pola_pengelolaan" TEXT,
    "metode_pengisian" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profil_koperasi_pkey" PRIMARY KEY ("koperasi_ref")
);

-- CreateTable
CREATE TABLE "referensi_koperasi_wilayah" (
    "koperasi_ref" TEXT NOT NULL,
    "kode_wilayah" TEXT NOT NULL,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_koperasi_wilayah_pkey" PRIMARY KEY ("koperasi_ref")
);

-- CreateTable
CREATE TABLE "anggota_koperasi" (
    "anggota_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nama" TEXT,
    "nik" TEXT,
    "kode_wilayah" TEXT,
    "jenis_kelamin" TEXT,
    "status_keanggotaan" TEXT,
    "tanggal_terdaftar" TIMESTAMP(3),
    "file_ktp" TEXT,
    "status_akun" TEXT,
    "pekerjaan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_koperasi_pkey" PRIMARY KEY ("anggota_ref")
);

-- CreateTable
CREATE TABLE "pengurus_koperasi" (
    "pengurus_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nama" TEXT,
    "jabatan" TEXT,
    "status" TEXT,
    "no_hp" TEXT,
    "nik" TEXT,
    "jenis_kelamin" TEXT,
    "foto_profil" TEXT,
    "email" TEXT,
    "alamat" TEXT,
    "kode_pos" TEXT,
    "tanggal_lahir" TEXT,
    "status_pendidikan" TEXT,
    "periode_mulai" TIMESTAMP(3),
    "periode_selesai" TIMESTAMP(3),
    "file_ktp" TEXT,
    "sumber_data" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengurus_koperasi_pkey" PRIMARY KEY ("pengurus_ref")
);

-- CreateTable
CREATE TABLE "karyawan_koperasi" (
    "karyawan_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nama" TEXT,
    "jabatan" TEXT,
    "nomor_hp_karyawan" TEXT,
    "jenis_kelamin" TEXT,
    "nik" TEXT,
    "email" TEXT,
    "status_karyawan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "karyawan_koperasi_pkey" PRIMARY KEY ("karyawan_ref")
);

-- CreateTable
CREATE TABLE "aset_koperasi" (
    "aset_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nama_aset" TEXT,
    "tipe_aset" TEXT,
    "status" TEXT,
    "progres_pembangunan" DOUBLE PRECISION,
    "foto_utama" TEXT,
    "foto_sekunder" TEXT,
    "dokumen_utama" TEXT,
    "dokumen_sekunder" TEXT,
    "dokumen_lainnya" TEXT,
    "luas_lahan" DECIMAL(18,2),
    "panjang_lahan" DECIMAL(18,2),
    "lebar_lahan" DECIMAL(18,2),
    "akses_jalan" TEXT,
    "koordinat_dibulatkan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aset_koperasi_pkey" PRIMARY KEY ("aset_ref")
);

-- CreateTable
CREATE TABLE "gerai_koperasi" (
    "gerai_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "jenis_gerai_ref" TEXT,
    "status_gerai" TEXT,
    "foto_gerai" TEXT,
    "pengisi" TEXT,
    "akses_internet" TEXT,
    "akses_listrik" TEXT,
    "status_kepemilikan_aset_gerai" TEXT,
    "status_pemanfaatan_aset_gerai" TEXT,
    "sumber_air_bersih" TEXT,
    "jenis_bangunan" TEXT,
    "koordinat_dibulatkan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gerai_koperasi_pkey" PRIMARY KEY ("gerai_ref")
);

-- CreateTable
CREATE TABLE "dokumen_koperasi" (
    "dokumen_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "jenis_dokumen_ref" TEXT,
    "nomor" TEXT,
    "tanggal_berlaku" TIMESTAMP(3),
    "tanggal_kadaluarsa" TIMESTAMP(3),
    "alamat_pada_dokumen" TEXT,
    "unggahan_dokumen" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dokumen_koperasi_pkey" PRIMARY KEY ("dokumen_ref")
);

-- CreateTable
CREATE TABLE "modal_koperasi" (
    "modal_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nomor_perjanjian" TEXT,
    "tipe_sumber" TEXT,
    "nama_sumber" TEXT,
    "tipe_modal" TEXT,
    "jumlah" DECIMAL(18,2),
    "tanggal_diterima" TIMESTAMP(3),
    "file_perjanjian" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modal_koperasi_pkey" PRIMARY KEY ("modal_ref")
);

-- CreateTable
CREATE TABLE "akun_bank_koperasi" (
    "akun_bank_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nama_rekening" TEXT,
    "nama_bank" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "akun_bank_koperasi_pkey" PRIMARY KEY ("akun_bank_ref")
);

-- CreateTable
CREATE TABLE "kbli_koperasi" (
    "id" SERIAL NOT NULL,
    "source_row_id" INTEGER,
    "koperasi_ref" TEXT NOT NULL,
    "kode_kbli" TEXT,
    "nama_kbli" TEXT,
    "tipe_izin_usaha" TEXT,
    "tahun_kbli" INTEGER,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kbli_koperasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengajuan_domain" (
    "domain_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "domain_koperasi" TEXT,
    "status_verifikasi" TEXT,
    "status_domain" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengajuan_domain_pkey" PRIMARY KEY ("domain_ref")
);

-- CreateTable
CREATE TABLE "pengajuan_kemitraan" (
    "pengajuan_kemitraan_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nik" TEXT,
    "penanggung_jawab" TEXT,
    "nomor_penanggung_jawab" TEXT,
    "status_permohonan" TEXT,
    "bisnis_kemitraan" TEXT,
    "paket_kemitraan" TEXT,
    "formulir_permohonan" TEXT,
    "ktp_penanggung_jawab" TEXT,
    "tipe_kemitraan" TEXT,
    "catatan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengajuan_kemitraan_pkey" PRIMARY KEY ("pengajuan_kemitraan_ref")
);

-- CreateTable
CREATE TABLE "pengajuan_pembiayaan" (
    "pengajuan_pembiayaan_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nik" TEXT,
    "penanggung_jawab" TEXT,
    "nomor_penanggung_jawab" TEXT,
    "status_permohonan" TEXT,
    "formulir_permohonan_pembiayaan" TEXT,
    "nominal_permohonan" DECIMAL(18,2),
    "tenor" INTEGER,
    "tujuan_permohonan" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengajuan_pembiayaan_pkey" PRIMARY KEY ("pengajuan_pembiayaan_ref")
);

-- CreateTable
CREATE TABLE "pengajuan_rekening_bank" (
    "pengajuan_rekening_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nik" TEXT,
    "penanggung_jawab" TEXT,
    "nomor_penanggung_jawab" TEXT,
    "status" TEXT,
    "kode_bank" TEXT,
    "nama_bank" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengajuan_rekening_bank_pkey" PRIMARY KEY ("pengajuan_rekening_ref")
);

-- CreateTable
CREATE TABLE "produk_koperasi" (
    "produk_sample_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "kode_barcode" TEXT,
    "nama_produk" TEXT,
    "unit" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_koperasi_pkey" PRIMARY KEY ("produk_sample_id")
);

-- CreateTable
CREATE TABLE "inventaris_produk" (
    "inventaris_ref" TEXT NOT NULL,
    "produk_sample_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nama_produk" TEXT,
    "stok" INTEGER,
    "kode_barcode" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventaris_produk_pkey" PRIMARY KEY ("inventaris_ref")
);

-- CreateTable
CREATE TABLE "barang_masuk_produk" (
    "barang_masuk_ref" TEXT NOT NULL,
    "produk_sample_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "kode_barcode" TEXT,
    "nama_produk" TEXT,
    "nama_tampilan" TEXT,
    "jumlah_masuk" INTEGER,
    "jumlah_tersedia" INTEGER,
    "harga_beli" DECIMAL(18,2),
    "harga_jual" DECIMAL(18,2),
    "total_biaya" DECIMAL(18,2),
    "keterangan" TEXT,
    "status" TEXT,
    "tanggal_masuk" TIMESTAMP(3),
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_masuk_produk_pkey" PRIMARY KEY ("barang_masuk_ref")
);

-- CreateTable
CREATE TABLE "transaksi_penjualan" (
    "transaksi_sample_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nama_pelanggan" TEXT,
    "tanggal_dibuat" TIMESTAMP(3),
    "total_pembayaran" DECIMAL(18,2),
    "status_transaksi" TEXT,
    "metode_pembayaran" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaksi_penjualan_pkey" PRIMARY KEY ("transaksi_sample_id")
);

-- CreateTable
CREATE TABLE "barang_keluar_produk" (
    "id" SERIAL NOT NULL,
    "source_row_id" INTEGER,
    "transaksi_sample_id" TEXT NOT NULL,
    "produk_sample_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "kode_barcode" TEXT,
    "tanggal_keluar" TIMESTAMP(3),
    "status" TEXT,
    "nama_produk" TEXT,
    "nama_tampilan" TEXT,
    "jumlah_keluar" INTEGER,
    "harga" DECIMAL(18,2),
    "total_nilai" DECIMAL(18,2),
    "status_transaksi" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_keluar_produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simpanan_anggota" (
    "simpanan_ref" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "anggota_ref" TEXT NOT NULL,
    "periode_pembayaran" TEXT,
    "jumlah_simpanan" DECIMAL(18,2),
    "status" TEXT,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "dibayar_pada" TIMESTAMP(3),

    CONSTRAINT "simpanan_anggota_pkey" PRIMARY KEY ("simpanan_ref")
);

-- CreateTable
CREATE TABLE "rat_koperasi" (
    "rat_sample_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "jenis_sektor_koperasi" TEXT,
    "urutan_rat" INTEGER,
    "tahun_buku" INTEGER,
    "tahun_rencana_kerja" INTEGER,
    "tahun_rencana_anggaran" INTEGER,
    "tanggal_rat" TIMESTAMP(3),
    "jumlah_peserta_rat" INTEGER,
    "status_rat" TEXT,
    "tahap_rat" INTEGER,
    "laporan_posisi_keuangan" JSONB,
    "laporan_hasil_usaha" JSONB,
    "rapb_posisi_keuangan" JSONB,
    "rapb_hasil_usaha" JSONB,
    "dibuat_pada" TIMESTAMP(3) NOT NULL,
    "diperbarui_pada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rat_koperasi_pkey" PRIMARY KEY ("rat_sample_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'OPERATOR_KOPERASI',
    "koperasi_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "actor_user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "address" TEXT,
    "capacity" DECIMAL(18,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commodities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "default_unit" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commodities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commodity_quality_schemas" (
    "id" TEXT NOT NULL,
    "commodity_id" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commodity_quality_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_lots" (
    "id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "commodity_id" TEXT NOT NULL,
    "member_ref" TEXT,
    "quantity" DECIMAL(18,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "harvest_date" TIMESTAMP(3),
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supply_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quality_records" (
    "id" TEXT NOT NULL,
    "supply_lot_id" TEXT NOT NULL,
    "grade" TEXT,
    "moisture" DECIMAL(6,2),
    "defect" TEXT,
    "tested_by" TEXT,
    "tested_at" TIMESTAMP(3),
    "verification_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quality_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_lots" (
    "id" TEXT NOT NULL,
    "supply_lot_id" TEXT NOT NULL,
    "facility_id" TEXT,
    "quantity" DECIMAL(18,2) NOT NULL,
    "condition" TEXT,
    "reserved_qty" DECIMAL(18,2),
    "available_qty" DECIMAL(18,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyers" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "kyb_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buyers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfqs" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "commodity_id" TEXT NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "moq" DECIMAL(18,2),
    "target_price" DECIMAL(18,2),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_items" (
    "id" TEXT NOT NULL,
    "rfq_id" TEXT NOT NULL,
    "spec_key" TEXT NOT NULL,
    "spec_value" TEXT NOT NULL,

    CONSTRAINT "rfq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "rfq_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "quoted_price" DECIMAL(18,2) NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pools" (
    "id" TEXT NOT NULL,
    "rfq_id" TEXT NOT NULL,
    "lead_koperasi_ref" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'FORMING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pool_allocations" (
    "id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "allocated_quantity" DECIMAL(18,2) NOT NULL,
    "coordination_fee" DECIMAL(18,2),

    CONSTRAINT "pool_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "rfq_id" TEXT,
    "buyer_id" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "contract_number" TEXT,
    "terms" JSONB,
    "signed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "po_number" TEXT,
    "quantity" DECIMAL(18,2) NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "pickup_date" TIMESTAMP(3),
    "delivery_date" TIMESTAMP(3),
    "proof_of_delivery_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_lots" (
    "id" TEXT NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "supply_lot_id" TEXT NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "shipment_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logistics_quotes" (
    "id" TEXT NOT NULL,
    "shipment_id" TEXT,
    "provider" TEXT,
    "cost" DECIMAL(18,2),
    "vehicle_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logistics_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quality_inspections" (
    "id" TEXT NOT NULL,
    "shipment_id" TEXT NOT NULL,
    "inspector" TEXT,
    "result" TEXT,
    "notes" TEXT,
    "inspected_at" TIMESTAMP(3),

    CONSTRAINT "quality_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "invoice_number" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "due_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "method" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlements" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "total_amount" DECIMAL(18,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "settled_at" TIMESTAMP(3),

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlement_lines" (
    "id" TEXT NOT NULL,
    "settlement_id" TEXT NOT NULL,
    "member_ref" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "description" TEXT,

    CONSTRAINT "settlement_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" TEXT NOT NULL,
    "koperasi_ref" TEXT,
    "buyer_id" TEXT,
    "subject" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_sessions" (
    "id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'whatsapp',
    "state" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3),

    CONSTRAINT "conversation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "content" TEXT,
    "media_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_calls" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "tool_name" TEXT NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_sources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "source_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embedding_chunks" (
    "id" TEXT NOT NULL,
    "document_source_id" TEXT NOT NULL,
    "chunk_text" TEXT NOT NULL,
    "embedding" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embedding_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referensi_komoditas_desa_kode_wilayah_idx" ON "referensi_komoditas_desa"("kode_wilayah");

-- CreateIndex
CREATE INDEX "referensi_koperasi_wilayah_kode_wilayah_idx" ON "referensi_koperasi_wilayah"("kode_wilayah");

-- CreateIndex
CREATE INDEX "anggota_koperasi_koperasi_ref_idx" ON "anggota_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "anggota_koperasi_kode_wilayah_idx" ON "anggota_koperasi"("kode_wilayah");

-- CreateIndex
CREATE INDEX "anggota_koperasi_status_keanggotaan_idx" ON "anggota_koperasi"("status_keanggotaan");

-- CreateIndex
CREATE INDEX "pengurus_koperasi_koperasi_ref_idx" ON "pengurus_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "karyawan_koperasi_koperasi_ref_idx" ON "karyawan_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "aset_koperasi_koperasi_ref_idx" ON "aset_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "gerai_koperasi_koperasi_ref_idx" ON "gerai_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "gerai_koperasi_jenis_gerai_ref_idx" ON "gerai_koperasi"("jenis_gerai_ref");

-- CreateIndex
CREATE INDEX "dokumen_koperasi_koperasi_ref_idx" ON "dokumen_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "dokumen_koperasi_jenis_dokumen_ref_idx" ON "dokumen_koperasi"("jenis_dokumen_ref");

-- CreateIndex
CREATE INDEX "modal_koperasi_koperasi_ref_idx" ON "modal_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "akun_bank_koperasi_koperasi_ref_idx" ON "akun_bank_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "kbli_koperasi_koperasi_ref_idx" ON "kbli_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "pengajuan_domain_koperasi_ref_idx" ON "pengajuan_domain"("koperasi_ref");

-- CreateIndex
CREATE INDEX "pengajuan_kemitraan_koperasi_ref_idx" ON "pengajuan_kemitraan"("koperasi_ref");

-- CreateIndex
CREATE INDEX "pengajuan_pembiayaan_koperasi_ref_idx" ON "pengajuan_pembiayaan"("koperasi_ref");

-- CreateIndex
CREATE INDEX "pengajuan_rekening_bank_koperasi_ref_idx" ON "pengajuan_rekening_bank"("koperasi_ref");

-- CreateIndex
CREATE INDEX "produk_koperasi_koperasi_ref_idx" ON "produk_koperasi"("koperasi_ref");

-- CreateIndex
CREATE INDEX "produk_koperasi_kode_barcode_idx" ON "produk_koperasi"("kode_barcode");

-- CreateIndex
CREATE INDEX "inventaris_produk_koperasi_ref_idx" ON "inventaris_produk"("koperasi_ref");

-- CreateIndex
CREATE INDEX "inventaris_produk_produk_sample_id_idx" ON "inventaris_produk"("produk_sample_id");

-- CreateIndex
CREATE INDEX "barang_masuk_produk_koperasi_ref_idx" ON "barang_masuk_produk"("koperasi_ref");

-- CreateIndex
CREATE INDEX "barang_masuk_produk_produk_sample_id_idx" ON "barang_masuk_produk"("produk_sample_id");

-- CreateIndex
CREATE INDEX "transaksi_penjualan_koperasi_ref_idx" ON "transaksi_penjualan"("koperasi_ref");

-- CreateIndex
CREATE INDEX "barang_keluar_produk_koperasi_ref_idx" ON "barang_keluar_produk"("koperasi_ref");

-- CreateIndex
CREATE INDEX "barang_keluar_produk_produk_sample_id_idx" ON "barang_keluar_produk"("produk_sample_id");

-- CreateIndex
CREATE INDEX "barang_keluar_produk_transaksi_sample_id_idx" ON "barang_keluar_produk"("transaksi_sample_id");

-- CreateIndex
CREATE INDEX "simpanan_anggota_koperasi_ref_idx" ON "simpanan_anggota"("koperasi_ref");

-- CreateIndex
CREATE INDEX "simpanan_anggota_anggota_ref_idx" ON "simpanan_anggota"("anggota_ref");

-- CreateIndex
CREATE INDEX "simpanan_anggota_status_idx" ON "simpanan_anggota"("status");

-- CreateIndex
CREATE INDEX "simpanan_anggota_periode_pembayaran_idx" ON "simpanan_anggota"("periode_pembayaran");

-- CreateIndex
CREATE INDEX "rat_koperasi_koperasi_ref_idx" ON "rat_koperasi"("koperasi_ref");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "audit_events_entity_entity_id_idx" ON "audit_events"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "facilities_koperasi_ref_idx" ON "facilities"("koperasi_ref");

-- CreateIndex
CREATE INDEX "commodity_quality_schemas_commodity_id_idx" ON "commodity_quality_schemas"("commodity_id");

-- CreateIndex
CREATE INDEX "supply_lots_koperasi_ref_idx" ON "supply_lots"("koperasi_ref");

-- CreateIndex
CREATE INDEX "supply_lots_commodity_id_idx" ON "supply_lots"("commodity_id");

-- CreateIndex
CREATE INDEX "quality_records_supply_lot_id_idx" ON "quality_records"("supply_lot_id");

-- CreateIndex
CREATE INDEX "inventory_lots_supply_lot_id_idx" ON "inventory_lots"("supply_lot_id");

-- CreateIndex
CREATE INDEX "inventory_lots_facility_id_idx" ON "inventory_lots"("facility_id");

-- CreateIndex
CREATE INDEX "rfqs_buyer_id_idx" ON "rfqs"("buyer_id");

-- CreateIndex
CREATE INDEX "rfqs_commodity_id_idx" ON "rfqs"("commodity_id");

-- CreateIndex
CREATE INDEX "rfq_items_rfq_id_idx" ON "rfq_items"("rfq_id");

-- CreateIndex
CREATE INDEX "offers_rfq_id_idx" ON "offers"("rfq_id");

-- CreateIndex
CREATE INDEX "offers_koperasi_ref_idx" ON "offers"("koperasi_ref");

-- CreateIndex
CREATE INDEX "pools_rfq_id_idx" ON "pools"("rfq_id");

-- CreateIndex
CREATE INDEX "pool_allocations_pool_id_idx" ON "pool_allocations"("pool_id");

-- CreateIndex
CREATE INDEX "pool_allocations_koperasi_ref_idx" ON "pool_allocations"("koperasi_ref");

-- CreateIndex
CREATE INDEX "contracts_buyer_id_idx" ON "contracts"("buyer_id");

-- CreateIndex
CREATE INDEX "contracts_koperasi_ref_idx" ON "contracts"("koperasi_ref");

-- CreateIndex
CREATE INDEX "purchase_orders_contract_id_idx" ON "purchase_orders"("contract_id");

-- CreateIndex
CREATE INDEX "shipments_purchase_order_id_idx" ON "shipments"("purchase_order_id");

-- CreateIndex
CREATE INDEX "shipment_lots_shipment_id_idx" ON "shipment_lots"("shipment_id");

-- CreateIndex
CREATE INDEX "shipment_lots_supply_lot_id_idx" ON "shipment_lots"("supply_lot_id");

-- CreateIndex
CREATE INDEX "logistics_quotes_shipment_id_idx" ON "logistics_quotes"("shipment_id");

-- CreateIndex
CREATE INDEX "quality_inspections_shipment_id_idx" ON "quality_inspections"("shipment_id");

-- CreateIndex
CREATE INDEX "invoices_contract_id_idx" ON "invoices"("contract_id");

-- CreateIndex
CREATE INDEX "payments_invoice_id_idx" ON "payments"("invoice_id");

-- CreateIndex
CREATE INDEX "settlements_contract_id_idx" ON "settlements"("contract_id");

-- CreateIndex
CREATE INDEX "settlement_lines_settlement_id_idx" ON "settlement_lines"("settlement_id");

-- CreateIndex
CREATE INDEX "complaints_koperasi_ref_idx" ON "complaints"("koperasi_ref");

-- CreateIndex
CREATE INDEX "complaints_buyer_id_idx" ON "complaints"("buyer_id");

-- CreateIndex
CREATE INDEX "conversation_sessions_phone_number_idx" ON "conversation_sessions"("phone_number");

-- CreateIndex
CREATE INDEX "messages_session_id_idx" ON "messages"("session_id");

-- CreateIndex
CREATE INDEX "tool_calls_session_id_idx" ON "tool_calls"("session_id");

-- CreateIndex
CREATE INDEX "embedding_chunks_document_source_id_idx" ON "embedding_chunks"("document_source_id");

-- AddForeignKey
ALTER TABLE "referensi_profil_desa" ADD CONSTRAINT "referensi_profil_desa_kode_wilayah_fkey" FOREIGN KEY ("kode_wilayah") REFERENCES "referensi_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referensi_komoditas_desa" ADD CONSTRAINT "referensi_komoditas_desa_kode_wilayah_fkey" FOREIGN KEY ("kode_wilayah") REFERENCES "referensi_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referensi_koperasi_wilayah" ADD CONSTRAINT "referensi_koperasi_wilayah_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referensi_koperasi_wilayah" ADD CONSTRAINT "referensi_koperasi_wilayah_kode_wilayah_fkey" FOREIGN KEY ("kode_wilayah") REFERENCES "referensi_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_koperasi" ADD CONSTRAINT "anggota_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_koperasi" ADD CONSTRAINT "anggota_koperasi_kode_wilayah_fkey" FOREIGN KEY ("kode_wilayah") REFERENCES "referensi_wilayah"("kode_wilayah") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengurus_koperasi" ADD CONSTRAINT "pengurus_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "karyawan_koperasi" ADD CONSTRAINT "karyawan_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aset_koperasi" ADD CONSTRAINT "aset_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gerai_koperasi" ADD CONSTRAINT "gerai_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gerai_koperasi" ADD CONSTRAINT "gerai_koperasi_jenis_gerai_ref_fkey" FOREIGN KEY ("jenis_gerai_ref") REFERENCES "referensi_gerai_koperasi"("jenis_gerai_ref") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dokumen_koperasi" ADD CONSTRAINT "dokumen_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dokumen_koperasi" ADD CONSTRAINT "dokumen_koperasi_jenis_dokumen_ref_fkey" FOREIGN KEY ("jenis_dokumen_ref") REFERENCES "referensi_dokumen_koperasi"("jenis_dokumen_ref") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modal_koperasi" ADD CONSTRAINT "modal_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "akun_bank_koperasi" ADD CONSTRAINT "akun_bank_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kbli_koperasi" ADD CONSTRAINT "kbli_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuan_domain" ADD CONSTRAINT "pengajuan_domain_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuan_kemitraan" ADD CONSTRAINT "pengajuan_kemitraan_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuan_pembiayaan" ADD CONSTRAINT "pengajuan_pembiayaan_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengajuan_rekening_bank" ADD CONSTRAINT "pengajuan_rekening_bank_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_koperasi" ADD CONSTRAINT "produk_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventaris_produk" ADD CONSTRAINT "inventaris_produk_produk_sample_id_fkey" FOREIGN KEY ("produk_sample_id") REFERENCES "produk_koperasi"("produk_sample_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventaris_produk" ADD CONSTRAINT "inventaris_produk_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang_masuk_produk" ADD CONSTRAINT "barang_masuk_produk_produk_sample_id_fkey" FOREIGN KEY ("produk_sample_id") REFERENCES "produk_koperasi"("produk_sample_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang_masuk_produk" ADD CONSTRAINT "barang_masuk_produk_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_penjualan" ADD CONSTRAINT "transaksi_penjualan_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang_keluar_produk" ADD CONSTRAINT "barang_keluar_produk_transaksi_sample_id_fkey" FOREIGN KEY ("transaksi_sample_id") REFERENCES "transaksi_penjualan"("transaksi_sample_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang_keluar_produk" ADD CONSTRAINT "barang_keluar_produk_produk_sample_id_fkey" FOREIGN KEY ("produk_sample_id") REFERENCES "produk_koperasi"("produk_sample_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang_keluar_produk" ADD CONSTRAINT "barang_keluar_produk_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simpanan_anggota" ADD CONSTRAINT "simpanan_anggota_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simpanan_anggota" ADD CONSTRAINT "simpanan_anggota_anggota_ref_fkey" FOREIGN KEY ("anggota_ref") REFERENCES "anggota_koperasi"("anggota_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rat_koperasi" ADD CONSTRAINT "rat_koperasi_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commodity_quality_schemas" ADD CONSTRAINT "commodity_quality_schemas_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "commodities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supply_lots" ADD CONSTRAINT "supply_lots_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "commodities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quality_records" ADD CONSTRAINT "quality_records_supply_lot_id_fkey" FOREIGN KEY ("supply_lot_id") REFERENCES "supply_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_supply_lot_id_fkey" FOREIGN KEY ("supply_lot_id") REFERENCES "supply_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "commodities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_items" ADD CONSTRAINT "rfq_items_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pools" ADD CONSTRAINT "pools_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pool_allocations" ADD CONSTRAINT "pool_allocations_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "buyers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_lots" ADD CONSTRAINT "shipment_lots_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_lots" ADD CONSTRAINT "shipment_lots_supply_lot_id_fkey" FOREIGN KEY ("supply_lot_id") REFERENCES "supply_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics_quotes" ADD CONSTRAINT "logistics_quotes_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quality_inspections" ADD CONSTRAINT "quality_inspections_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlement_lines" ADD CONSTRAINT "settlement_lines_settlement_id_fkey" FOREIGN KEY ("settlement_id") REFERENCES "settlements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_calls" ADD CONSTRAINT "tool_calls_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embedding_chunks" ADD CONSTRAINT "embedding_chunks_document_source_id_fkey" FOREIGN KEY ("document_source_id") REFERENCES "document_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
