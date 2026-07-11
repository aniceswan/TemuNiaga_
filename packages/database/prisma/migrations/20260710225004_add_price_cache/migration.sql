-- CreateTable
CREATE TABLE "price_cache" (
    "id" TEXT NOT NULL,
    "commodity_id" TEXT NOT NULL,
    "region" TEXT,
    "harga_min" DECIMAL(18,2) NOT NULL,
    "harga_median" DECIMAL(18,2) NOT NULL,
    "harga_max" DECIMAL(18,2) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "sumber" TEXT NOT NULL DEFAULT 'BPS',
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "price_cache_commodity_id_region_idx" ON "price_cache"("commodity_id", "region");

-- AddForeignKey
ALTER TABLE "price_cache" ADD CONSTRAINT "price_cache_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "commodities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
