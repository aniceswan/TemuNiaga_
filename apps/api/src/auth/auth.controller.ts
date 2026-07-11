import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./login.dto";
import type { AuthenticatedRequest } from "./authenticated-request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get("me")
  me() {
    return { id: "public", email: "public@temuniaga.id", name: "Public User", role: "PUBLIC", koperasiRef: null };
  }
}
