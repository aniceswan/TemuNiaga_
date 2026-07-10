import type { Request } from "express";
import type { JwtPayload } from "@temuniaga/auth";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
