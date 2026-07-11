import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateProdukDto {
  @IsString()
  @IsNotEmpty()
  koperasiRef!: string;

  @IsString()
  @IsNotEmpty()
  namaProduk!: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsPositive()
  hargaJual!: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stok?: number;
}
