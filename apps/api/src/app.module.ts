import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { RbacModule } from "./rbac/rbac.module";
import { KoperasiModule } from "./koperasi/koperasi.module";
import { AnggotaModule } from "./anggota/anggota.module";
import { AuditModule } from "./audit/audit.module";
import { HealthModule } from "./health/health.module";
import { HargaModule } from "./harga/harga.module";
import { PasokanModule } from "./pasokan/pasokan.module";
import { SimpananModule } from "./simpanan/simpanan.module";
import { WaModule } from "./wa/wa.module";
import { ProdukModule } from "./produk/produk.module";
import { PesananModule } from "./pesanan/pesanan.module";
import { AuditInterceptor } from "./audit/audit.interceptor";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RbacModule,
    KoperasiModule,
    AnggotaModule,
    AuditModule,
    HealthModule,
    HargaModule,
    PasokanModule,
    SimpananModule,
    WaModule,
    ProdukModule,
    PesananModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
})
export class AppModule {}
