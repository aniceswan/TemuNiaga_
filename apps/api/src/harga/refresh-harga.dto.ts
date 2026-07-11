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

  /** BPS year-id ("th"), required by webapi -- e.g. "123" = 2023. Look up valid values via BPS's var/th list for your dataset. */
  @IsString()
  @IsNotEmpty()
  th!: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  unit?: string;
}
