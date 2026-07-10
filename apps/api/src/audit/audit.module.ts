import { Module } from "@nestjs/common";
import { AuditController } from "./audit.controller";
import { AuditInterceptor } from "./audit.interceptor";
import { RbacModule } from "../rbac/rbac.module";

@Module({
  imports: [RbacModule],
  controllers: [AuditController],
  providers: [AuditInterceptor],
  exports: [AuditInterceptor],
})
export class AuditModule {}
