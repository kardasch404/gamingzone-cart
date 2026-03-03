import { Injectable } from '@nestjs/common';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';

@Injectable()
export class ClearCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<void> {
    await this.cartRepository.delete(userId);
  }
}
