-- CreateTable
CREATE TABLE "wa_registrations" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "anggota_ref" TEXT,
    "koperasi_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wa_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wa_registrations_phone_key" ON "wa_registrations"("phone");
