-- AlterTable
ALTER TABLE "produk_koperasi" ADD COLUMN     "harga_jual" DECIMAL(18,2);

-- CreateTable
CREATE TABLE "pesanan" (
    "pesananRef" TEXT NOT NULL,
    "koperasi_ref" TEXT NOT NULL,
    "nama_pembeli" TEXT NOT NULL,
    "telepon_pembeli" TEXT NOT NULL,
    "alamat_pembeli" TEXT NOT NULL,
    "total_harga" DECIMAL(18,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Baru',
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pesanan_pkey" PRIMARY KEY ("pesananRef")
);

-- CreateTable
CREATE TABLE "pesanan_item" (
    "id" TEXT NOT NULL,
    "pesanan_ref" TEXT NOT NULL,
    "produk_sample_id" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "harga_satuan" DECIMAL(18,2) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "subtotal" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "pesanan_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pesanan_koperasi_ref_idx" ON "pesanan"("koperasi_ref");

-- CreateIndex
CREATE INDEX "pesanan_item_pesanan_ref_idx" ON "pesanan_item"("pesanan_ref");

-- AddForeignKey
ALTER TABLE "pesanan" ADD CONSTRAINT "pesanan_koperasi_ref_fkey" FOREIGN KEY ("koperasi_ref") REFERENCES "profil_koperasi"("koperasi_ref") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan_item" ADD CONSTRAINT "pesanan_item_pesanan_ref_fkey" FOREIGN KEY ("pesanan_ref") REFERENCES "pesanan"("pesananRef") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesanan_item" ADD CONSTRAINT "pesanan_item_produk_sample_id_fkey" FOREIGN KEY ("produk_sample_id") REFERENCES "produk_koperasi"("produk_sample_id") ON DELETE RESTRICT ON UPDATE CASCADE;
