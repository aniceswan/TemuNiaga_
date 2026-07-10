import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from "@nestjs/common";
import { tap } from "rxjs/operators";
import type { Observable } from "rxjs";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedRequest } from "../auth/authenticated-request";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** Writes an AuditEvent row for every mutating request (plan.md §16.4 rule 7: tool/action calls are audited). */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return next.handle().pipe(
      tap(() => {
        if (!MUTATING_METHODS.has(request.method)) return;
        this.prisma.client.auditEvent
          .create({
            data: {
              actorUserId: request.user?.sub ?? null,
              action: request.method,
              entity: request.route?.path ?? request.path,
              entityId: Object.values(request.params ?? {})[0] ?? null,
              metadata: { body: request.body, query: request.query },
            },
          })
          .catch((err: unknown) => console.error("AuditInterceptor failed to write audit event:", err));
      }),
    );
  }
}
