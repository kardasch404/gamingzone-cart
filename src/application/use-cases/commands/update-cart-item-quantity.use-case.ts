import { Injectable } from '@nestjs/common';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { UpdateCartItemDto } from '@application/dto/request/update-cart-item.dto';
import { CartDto } from '@application/dto/response/cart.dto';
import { CartNotFoundException } from '@application/exceptions/cart.exceptions';

@Injectable()
export class UpdateCartItemQuantityUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(dto: UpdateCartItemDto): Promise<CartDto> {
    const cart = await this.cartRepository.findByUserId(dto.userId);
    
    if (!cart) {
      throw new CartNotFoundException(dto.userId);
    }
    
    cart.updateItemQuantity(dto.sku, dto.quantity);
    await this.cartRepository.save(cart);
    
    return CartDto.fromDomain(cart);
  }
}
