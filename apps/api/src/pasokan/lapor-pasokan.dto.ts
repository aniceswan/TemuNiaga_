import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class LaporPasokanDto {
  @IsString()
  @IsNotEmpty()
  koperasiRef!: string;

  @IsString()
  @IsNotEmpty()
  komoditas!: string;

  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  memberRef?: string;
}
