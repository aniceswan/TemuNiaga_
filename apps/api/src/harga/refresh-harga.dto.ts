import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RefreshHargaDto {
  @IsString()
  @IsNotEmpty()
  komoditas!: string;

  /** BPS domain code, e.g. "0000" for national. Picked per commodity/region from your BPS account. */
  @IsString()
  @IsNotEmpty()
  domain!: string;

  /** BPS dynamic-table variable ID for this commodity's price series. */
  @IsString()
  @IsNotEmpty()
  varId!: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  unit?: string;
}
