import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { readCsvBatches } from "./lib/csv";
import { toDecimal, toDate, toInt, toFloat, toStr, toJson } from "./lib/parse";

const prisma = new PrismaClient();

// db_export/ lives at the repo root; this file is packages/database/prisma/seed/index.ts
const DB_EXPORT_DIR = path.resolve(__dirname, "../../../../db_export");
const BATCH_SIZE = 2000;

function csvPath(name: string): string {
  return path.join(DB_EXPORT_DIR, name);
}

type Row = Record<string, string>;

async function seedTable<T>(
  label: string,
  file: string,
  mapRow: (row: Row) => T,
  createMany: (rows: T[]) => Promise<{ count: number }>,
): Promise<void> {
  const start = Date.now();
  let count = 0;
  await readCsvBatches<Row>(csvPath(file), BATCH_SIZE, async (rows) => {
    const data = rows.map(mapRow);
    const result = await createMany(data);
    count += result.count;
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  ✓ ${label}: ${count} rows (${elapsed}s)`);
}

async function main(): Promise<void> {
  console.log(`Seeding from ${DB_EXPORT_DIR}\n`);

  console.log("1/12 Reference tables (Wilayah, JenisDokumen, JenisGerai)");
  await seedTable(
    "Wilayah",
    "referensi_wilayah.csv",
    (r) => ({
      kodeWilayah: r.kode_wilayah!,
      provinsi: toStr(r.provinsi),
      kabKota: toStr(r.kab_kota),
      kecamatan: toStr(r.kecamatan),
      desaKelurahan: toStr(r.desa_kelurahan),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.wilayah.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "JenisDokumen",
    "referensi_dokumen_koperasi.csv",
    (r) => ({
      jenisDokumenRef: r.jenis_dokumen_ref!,
      namaDokumen: toStr(r.nama_dokumen),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.jenisDokumen.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "JenisGerai",
    "referensi_gerai_koperasi.csv",
    (r) => ({
      jenisGeraiRef: r.jenis_gerai_ref!,
      namaJenisGerai: toStr(r.nama_jenis_gerai),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.jenisGerai.createMany({ data, skipDuplicates: true }),
  );

  console.log("2/12 ProfilDesa, KomoditasDesa (-> Wilayah)");
  await seedTable(
    "ProfilDesa",
    "referensi_profil_desa.csv",
    (r) => ({
      kodeWilayah: r.kode_wilayah!,
      tahunPopulasi: toInt(r.tahun_populasi),
      totalPenduduk: toInt(r.total_penduduk),
      pendudukLakiLaki: toInt(r.penduduk_laki_laki),
      pendudukPerempuan: toInt(r.penduduk_perempuan),
      tahunPendanaan: toInt(r.tahun_pendanaan),
      anggaranDanaDesa: toDecimal(r.anggaran_dana_desa),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.profilDesa.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "KomoditasDesa",
    "referensi_komoditas_desa.csv",
    (r) => ({
      komoditasRef: r.komoditas_ref!,
      kodeWilayah: r.kode_wilayah!,
      namaKomoditas: toStr(r.nama_komoditas),
      luasArea: toStr(r.luas_area),
      volume: toStr(r.volume),
      jumlahSdmTerlibat: toInt(r.jumlah_sdm_terlibat),
      nilaiPotensiDesa: toDecimal(r.nilai_potensi_desa),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.komoditasDesa.createMany({ data, skipDuplicates: true }),
  );

  console.log("3/12 Koperasi");
  await seedTable(
    "Koperasi",
    "profil_koperasi.csv",
    (r) => ({
      koperasiRef: r.koperasi_ref!,
      namaKoperasi: r.nama_koperasi!,
      statusRegistrasi: toStr(r.status_registrasi),
      bentukKoperasi: toStr(r.bentuk_koperasi),
      kategoriUsaha: toStr(r.kategori_usaha),
      nikKoperasi: toStr(r.nik_koperasi),
      alamatLengkap: toStr(r.alamat_lengkap),
      kodePos: toStr(r.kode_pos),
      koordinatDibulatkan: toStr(r.koordinat_dibulatkan),
      modalAwal: toDecimal(r.modal_awal),
      sumberPersetujuan: toStr(r.sumber_persetujuan),
      tentangKoperasi: toStr(r.tentang_koperasi),
      polaPengelolaan: toStr(r.pola_pengelolaan),
      metodePengisian: toStr(r.metode_pengisian),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.koperasi.createMany({ data, skipDuplicates: true }),
  );

  console.log("4/12 KoperasiWilayah (-> Koperasi, Wilayah)");
  await seedTable(
    "KoperasiWilayah",
    "referensi_koperasi_wilayah.csv",
    (r) => ({
      koperasiRef: r.koperasi_ref!,
      kodeWilayah: r.kode_wilayah!,
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.koperasiWilayah.createMany({ data, skipDuplicates: true }),
  );

  console.log("5/12 Koperasi-scoped master data");
  await seedTable(
    "Kbli",
    "kbli_koperasi.csv",
    (r) => ({
      sourceRowId: toInt(r.__row_id),
      koperasiRef: r.koperasi_ref!,
      kodeKbli: toStr(r.kode_kbli),
      namaKbli: toStr(r.nama_kbli),
      tipeIzinUsaha: toStr(r.tipe_izin_usaha),
      tahunKbli: toInt(r.tahun_kbli),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.kbli.createMany({ data }),
  );
  await seedTable(
    "Dokumen",
    "dokumen_koperasi.csv",
    (r) => ({
      dokumenRef: r.dokumen_ref!,
      koperasiRef: r.koperasi_ref!,
      jenisDokumenRef: toStr(r.jenis_dokumen_ref!),
      nomor: toStr(r.nomor),
      tanggalBerlaku: toDate(r.tanggal_berlaku),
      tanggalKadaluarsa: toDate(r.tanggal_kadaluarsa),
      alamatPadaDokumen: toStr(r.alamat_pada_dokumen),
      unggahanDokumen: toStr(r.unggahan_dokumen),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.dokumen.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "Aset",
    "aset_koperasi.csv",
    (r) => ({
      asetRef: r.aset_ref!,
      koperasiRef: r.koperasi_ref!,
      namaAset: toStr(r.nama_aset),
      tipeAset: toStr(r.tipe_aset),
      status: toStr(r.status),
      progresPembangunan: toFloat(r.progres_pembangunan),
      fotoUtama: toStr(r.foto_utama),
      fotoSekunder: toStr(r.foto_sekunder),
      dokumenUtama: toStr(r.dokumen_utama),
      dokumenSekunder: toStr(r.dokumen_sekunder),
      dokumenLainnya: toStr(r.dokumen_lainnya),
      luasLahan: toDecimal(r.luas_lahan),
      panjangLahan: toDecimal(r.panjang_lahan),
      lebarLahan: toDecimal(r.lebar_lahan),
      aksesJalan: toStr(r.akses_jalan),
      koordinatDibulatkan: toStr(r.koordinat_dibulatkan),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada), // blank in ~48% of source rows
    }),
    (data) => prisma.aset.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "Gerai",
    "gerai_koperasi.csv",
    (r) => ({
      geraiRef: r.gerai_ref!,
      koperasiRef: r.koperasi_ref!,
      jenisGeraiRef: toStr(r.jenis_gerai_ref!),
      statusGerai: toStr(r.status_gerai),
      fotoGerai: toStr(r.foto_gerai),
      pengisi: toStr(r.pengisi),
      aksesInternet: toStr(r.akses_internet),
      aksesListrik: toStr(r.akses_listrik),
      statusKepemilikanAsetGerai: toStr(r.status_kepemilikan_aset_gerai),
      statusPemanfaatanAsetGerai: toStr(r.status_pemanfaatan_aset_gerai),
      sumberAirBersih: toStr(r.sumber_air_bersih),
      jenisBangunan: toStr(r.jenis_bangunan),
      koordinatDibulatkan: toStr(r.koordinat_dibulatkan),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.gerai.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "Modal",
    "modal_koperasi.csv",
    (r) => ({
      modalRef: r.modal_ref!,
      koperasiRef: r.koperasi_ref!,
      nomorPerjanjian: toStr(r.nomor_perjanjian),
      tipeSumber: toStr(r.tipe_sumber),
      namaSumber: toStr(r.nama_sumber),
      tipeModal: toStr(r.tipe_modal),
      jumlah: toDecimal(r.jumlah),
      tanggalDiterima: toDate(r.tanggal_diterima),
      filePerjanjian: toStr(r.file_perjanjian),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.modal.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "AkunBank",
    "akun_bank_koperasi.csv",
    (r) => ({
      akunBankRef: r.akun_bank_ref!,
      koperasiRef: r.koperasi_ref!,
      namaRekening: toStr(r.nama_rekening),
      namaBank: toStr(r.nama_bank),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.akunBank.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "Pengurus",
    "pengurus_koperasi.csv",
    (r) => ({
      pengurusRef: r.pengurus_ref!,
      koperasiRef: r.koperasi_ref!,
      nama: toStr(r.nama),
      jabatan: toStr(r.jabatan),
      status: toStr(r.status),
      noHp: toStr(r.no_hp),
      nik: toStr(r.nik),
      jenisKelamin: toStr(r.jenis_kelamin),
      fotoProfil: toStr(r.foto_profil),
      email: toStr(r.email),
      alamat: toStr(r.alamat),
      kodePos: toStr(r.kode_pos),
      tanggalLahir: toStr(r.tanggal_lahir), // masked "1973-**-**" — String, not DateTime
      statusPendidikan: toStr(r.status_pendidikan),
      periodeMulai: toDate(r.periode_mulai),
      periodeSelesai: toDate(r.periode_selesai),
      fileKtp: toStr(r.file_ktp),
      sumberData: toStr(r.sumber_data),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.pengurus.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "Karyawan",
    "karyawan_koperasi.csv",
    (r) => ({
      karyawanRef: r.karyawan_ref!,
      koperasiRef: r.koperasi_ref!,
      nama: toStr(r.nama),
      jabatan: toStr(r.jabatan),
      nomorHpKaryawan: toStr(r.nomor_hp_karyawan),
      jenisKelamin: toStr(r.jenis_kelamin),
      nik: toStr(r.nik),
      email: toStr(r.email),
      statusKaryawan: toStr(r.status_karyawan),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.karyawan.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "PengajuanDomain",
    "pengajuan_domain.csv",
    (r) => ({
      domainRef: r.domain_ref!,
      koperasiRef: r.koperasi_ref!,
      domainKoperasi: toStr(r.domain_koperasi),
      statusVerifikasi: toStr(r.status_verifikasi),
      statusDomain: toStr(r.status_domain),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.pengajuanDomain.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "PengajuanKemitraan",
    "pengajuan_kemitraan.csv",
    (r) => ({
      pengajuanKemitraanRef: r.pengajuan_kemitraan_ref!,
      koperasiRef: r.koperasi_ref!,
      nik: toStr(r.nik),
      penanggungJawab: toStr(r.penanggung_jawab),
      nomorPenanggungJawab: toStr(r.nomor_penanggung_jawab),
      statusPermohonan: toStr(r.status_permohonan),
      bisnisKemitraan: toStr(r.bisnis_kemitraan),
      paketKemitraan: toStr(r.paket_kemitraan),
      formulirPermohonan: toStr(r.formulir_permohonan),
      ktpPenanggungJawab: toStr(r.ktp_penanggung_jawab),
      tipeKemitraan: toStr(r.tipe_kemitraan),
      catatan: toStr(r.catatan),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.pengajuanKemitraan.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "PengajuanPembiayaan",
    "pengajuan_pembiayaan.csv",
    (r) => ({
      pengajuanPembiayaanRef: r.pengajuan_pembiayaan_ref!,
      koperasiRef: r.koperasi_ref!,
      nik: toStr(r.nik),
      penanggungJawab: toStr(r.penanggung_jawab),
      nomorPenanggungJawab: toStr(r.nomor_penanggung_jawab),
      statusPermohonan: toStr(r.status_permohonan),
      formulirPermohonanPembiayaan: toStr(r.formulir_permohonan_pembiayaan),
      nominalPermohonan: toDecimal(r.nominal_permohonan), // handles "3e+09"
      tenor: toInt(r.tenor),
      tujuanPermohonan: toStr(r.tujuan_permohonan),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.pengajuanPembiayaan.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "PengajuanRekeningBank",
    "pengajuan_rekening_bank.csv",
    (r) => ({
      pengajuanRekeningRef: r.pengajuan_rekening_ref!,
      koperasiRef: r.koperasi_ref!,
      nik: toStr(r.nik),
      penanggungJawab: toStr(r.penanggung_jawab),
      nomorPenanggungJawab: toStr(r.nomor_penanggung_jawab),
      status: toStr(r.status),
      kodeBank: toStr(r.kode_bank),
      namaBank: toStr(r.nama_bank),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.pengajuanRekeningBank.createMany({ data, skipDuplicates: true }),
  );

  console.log("6/12 Anggota (74,270 rows)");
  await seedTable(
    "Anggota",
    "anggota_koperasi.csv",
    (r) => ({
      anggotaRef: r.anggota_ref!,
      koperasiRef: r.koperasi_ref!,
      nama: toStr(r.nama),
      nik: toStr(r.nik),
      kodeWilayah: toStr(r.kode_wilayah!),
      jenisKelamin: toStr(r.jenis_kelamin),
      statusKeanggotaan: toStr(r.status_keanggotaan),
      tanggalTerdaftar: toDate(r.tanggal_terdaftar),
      fileKtp: toStr(r.file_ktp),
      statusAkun: toStr(r.status_akun),
      pekerjaan: toStr(r.pekerjaan),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.anggota.createMany({ data, skipDuplicates: true }),
  );

  console.log("7/12 Produk");
  await seedTable(
    "Produk",
    "produk_koperasi.csv",
    (r) => ({
      produkSampleId: r.produk_sample_id!,
      koperasiRef: r.koperasi_ref!,
      kodeBarcode: toStr(r.kode_barcode),
      namaProduk: toStr(r.nama_produk),
      unit: toStr(r.unit),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.produk.createMany({ data, skipDuplicates: true }),
  );

  console.log("8/12 Inventaris, BarangMasuk");
  await seedTable(
    "Inventaris",
    "inventaris_produk.csv",
    (r) => ({
      inventarisRef: r.inventaris_ref!,
      produkSampleId: r.produk_sample_id!,
      koperasiRef: r.koperasi_ref!,
      namaProduk: toStr(r.nama_produk),
      stok: toInt(r.stok),
      kodeBarcode: toStr(r.kode_barcode),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.inventaris.createMany({ data, skipDuplicates: true }),
  );
  await seedTable(
    "BarangMasuk",
    "barang_masuk_produk.csv",
    (r) => ({
      barangMasukRef: r.barang_masuk_ref!,
      produkSampleId: r.produk_sample_id!,
      koperasiRef: r.koperasi_ref!,
      kodeBarcode: toStr(r.kode_barcode),
      namaProduk: toStr(r.nama_produk),
      namaTampilan: toStr(r.nama_tampilan),
      jumlahMasuk: toInt(r.jumlah_masuk),
      jumlahTersedia: toInt(r.jumlah_tersedia),
      hargaBeli: toDecimal(r.harga_beli),
      hargaJual: toDecimal(r.harga_jual),
      totalBiaya: toDecimal(r.total_biaya),
      keterangan: toStr(r.keterangan),
      status: toStr(r.status),
      tanggalMasuk: toDate(r.tanggal_masuk),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.barangMasuk.createMany({ data, skipDuplicates: true }),
  );

  console.log("9/12 TransaksiPenjualan");
  await seedTable(
    "TransaksiPenjualan",
    "transaksi_penjualan.csv",
    (r) => ({
      transaksiSampleId: r.transaksi_sample_id!,
      koperasiRef: r.koperasi_ref!,
      namaPelanggan: toStr(r.nama_pelanggan),
      tanggalDibuat: toDate(r.tanggal_dibuat),
      totalPembayaran: toDecimal(r.total_pembayaran),
      statusTransaksi: toStr(r.status_transaksi),
      metodePembayaran: toStr(r.metode_pembayaran),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.transaksiPenjualan.createMany({ data, skipDuplicates: true }),
  );

  console.log("10/12 BarangKeluar (-> TransaksiPenjualan, Produk)");
  await seedTable(
    "BarangKeluar",
    "barang_keluar_produk.csv",
    (r) => ({
      sourceRowId: toInt(r.__row_id),
      transaksiSampleId: r.transaksi_sample_id!,
      produkSampleId: r.produk_sample_id!,
      koperasiRef: r.koperasi_ref!,
      kodeBarcode: toStr(r.kode_barcode),
      tanggalKeluar: toDate(r.tanggal_keluar),
      status: toStr(r.status),
      namaProduk: toStr(r.nama_produk),
      namaTampilan: toStr(r.nama_tampilan),
      jumlahKeluar: toInt(r.jumlah_keluar),
      harga: toDecimal(r.harga),
      totalNilai: toDecimal(r.total_nilai),
      statusTransaksi: toStr(r.status_transaksi),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.barangKeluar.createMany({ data }),
  );

  console.log("11/12 Simpanan (372,408 rows, largest table)");
  await seedTable(
    "Simpanan",
    "simpanan_anggota.csv",
    (r) => ({
      simpananRef: r.simpanan_ref!,
      koperasiRef: r.koperasi_ref!,
      anggotaRef: r.anggota_ref!,
      periodePembayaran: toStr(r.periode_pembayaran),
      jumlahSimpanan: toDecimal(r.jumlah_simpanan),
      status: toStr(r.status),
      dibuatPada: toDate(r.dibuat_pada)!,
      dibayarPada: toDate(r.dibayar_pada),
    }),
    (data) => prisma.simpanan.createMany({ data, skipDuplicates: true }),
  );

  console.log("12/12 Rat");
  await seedTable(
    "Rat",
    "rat_koperasi.csv",
    (r) => ({
      ratSampleId: r.rat_sample_id!,
      koperasiRef: r.koperasi_ref!,
      jenisSektorKoperasi: toStr(r.jenis_sektor_koperasi),
      urutanRat: toInt(r.urutan_rat),
      tahunBuku: toInt(r.tahun_buku),
      tahunRencanaKerja: toInt(r.tahun_rencana_kerja),
      tahunRencanaAnggaran: toInt(r.tahun_rencana_anggaran),
      tanggalRat: toDate(r.tanggal_rat),
      jumlahPesertaRat: toInt(r.jumlah_peserta_rat),
      statusRat: toStr(r.status_rat),
      tahapRat: toInt(r.tahap_rat),
      laporanPosisiKeuangan: toJson(r.laporan_posisi_keuangan),
      laporanHasilUsaha: toJson(r.laporan_hasil_usaha),
      rapbPosisiKeuangan: toJson(r.rapb_posisi_keuangan),
      rapbHasilUsaha: toJson(r.rapb_hasil_usaha),
      dibuatPada: toDate(r.dibuat_pada)!,
      diperbaruiPada: toDate(r.diperbarui_pada)!,
    }),
    (data) => prisma.rat.createMany({ data, skipDuplicates: true }),
  );

  console.log("\nSeed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
