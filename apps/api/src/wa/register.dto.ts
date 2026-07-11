import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterWaDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsOptional()
  anggotaRef?: string;

  @IsString()
  @IsOptional()
  koperasiRef?: string;
}
