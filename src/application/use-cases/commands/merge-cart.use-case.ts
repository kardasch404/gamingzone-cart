import { Injectable } from '@nestjs/common';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { Cart } from '@domain/aggregates/cart.aggregate';
import { CartDto } from '@application/dto/response/cart.dto';
import { MergeCartDto } from '@application/dto/request/merge-cart.dto';

@Injectable()
export class MergeCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(dto: MergeCartDto): Promise<CartDto> {
    const guestCart = await this.cartRepository.findByUserId(dto.guestCartId);
    const userCart = await this.cartRepository.findByUserId(dto.userId) || new Cart(dto.userId);

    if (guestCart && !guestCart.isEmpty()) {
      const guestItems = guestCart.getItems();
      
      for (const guestItem of guestItems) {
        const existingItem = userCart.getItems().find(item => item.sku === guestItem.sku);
        
        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + guestItem.quantity, 10);
          userCart.updateItemQuantity(guestItem.sku, newQuantity);
        } else {
          userCart.addItem(guestItem);
        }
      }

      await this.cartRepository.delete(dto.guestCartId);
    }

    await this.cartRepository.save(userCart);
    return CartDto.fromDomain(userCart);
  }
}
