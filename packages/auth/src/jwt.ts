import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role } from "./role";

export interface JwtPayload {
  sub: string; // User.id
  email: string;
  role: Role;
  koperasiRef: string | null;
}

const DEFAULT_EXPIRES_IN: NonNullable<SignOptions["expiresIn"]> = "8h";

export function signJwt(
  payload: JwtPayload,
  secret: string,
  expiresIn: NonNullable<SignOptions["expiresIn"]> = DEFAULT_EXPIRES_IN,
): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}
