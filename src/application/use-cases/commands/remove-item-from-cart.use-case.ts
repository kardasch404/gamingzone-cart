import { Injectable } from '@nestjs/common';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { RemoveItemDto } from '@application/dto/request/remove-item.dto';
import { CartDto } from '@application/dto/response/cart.dto';
import { CartNotFoundException } from '@application/exceptions/cart.exceptions';

@Injectable()
export class RemoveItemFromCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(dto: RemoveItemDto): Promise<CartDto> {
    const cart = await this.cartRepository.findByUserId(dto.userId);
    
    if (!cart) {
      throw new CartNotFoundException(dto.userId);
    }
    
    cart.removeItem(dto.sku);
    await this.cartRepository.save(cart);
    
    return CartDto.fromDomain(cart);
  }
}
