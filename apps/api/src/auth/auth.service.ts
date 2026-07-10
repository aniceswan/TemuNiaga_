import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { signJwt, type Role } from "@temuniaga/auth";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid email or password");

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) throw new UnauthorizedException("Invalid email or password");

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");

    const accessToken = signJwt(
      { sub: user.id, email: user.email, role: user.role as Role, koperasiRef: user.koperasiRef },
      secret,
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        koperasiRef: user.koperasiRef,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("User not found");
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      koperasiRef: user.koperasiRef,
    };
  }
}
