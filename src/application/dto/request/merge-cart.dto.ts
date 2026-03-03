import { IsString } from 'class-validator';

export class MergeCartDto {
  @IsString()
  guestCartId: string;

  @IsString()
  userId: string;
}
