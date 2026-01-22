import { IsString } from 'class-validator';

export class RemoveItemDto {
  @IsString()
  userId: string;

  @IsString()
  sku: string;
}
