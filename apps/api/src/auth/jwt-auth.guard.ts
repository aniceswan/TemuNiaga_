import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { verifyJwt } from "@temuniaga/auth";
import type { AuthenticatedRequest } from "./authenticated-request";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
    if (!token) throw new UnauthorizedException("Missing bearer token");

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new UnauthorizedException("JWT_SECRET is not configured");

    try {
      request.user = verifyJwt(token, secret);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
