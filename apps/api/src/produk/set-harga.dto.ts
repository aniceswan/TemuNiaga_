import { IsNumber, IsPositive } from "class-validator";

export class SetHargaDto {
  @IsNumber()
  @IsPositive()
  hargaJual!: number;
}
