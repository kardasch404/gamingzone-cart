import { IsString, IsNumber, Min, Max } from 'class-validator';

export class AddItemToCartDto {
  @IsString()
  userId: string;

  @IsString()
  sku: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  quantity: number;
}
