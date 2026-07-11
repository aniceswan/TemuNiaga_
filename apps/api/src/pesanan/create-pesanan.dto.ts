import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsPositive, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  produkSampleId!: string;

  @IsInt()
  @IsPositive()
  jumlah!: number;
}

export class CreatePesananDto {
  @IsString()
  @IsNotEmpty()
  namaPembeli!: string;

  @IsString()
  @IsNotEmpty()
  teleponPembeli!: string;

  @IsString()
  @IsNotEmpty()
  alamatPembeli!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items!: CartItemDto[];
}
