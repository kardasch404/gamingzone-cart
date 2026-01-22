import { Injectable } from '@nestjs/common';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { CartDto } from '@application/dto/response/cart.dto';
import { Cart } from '@domain/aggregates/cart.aggregate';

@Injectable()
export class GetCartQuery {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<CartDto | null> {
    const cart = await this.cartRepository.findByUserId(userId);
    
    if (!cart) {
      return null;
    }
    
    return CartDto.fromDomain(cart);
  }

  async getOrCreate(userId: string): Promise<CartDto> {
    const cart = await this.cartRepository.findByUserId(userId) || new Cart(userId);
    return CartDto.fromDomain(cart);
  }
}
