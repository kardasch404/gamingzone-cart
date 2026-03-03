import { Injectable } from '@nestjs/common';
import { Cart } from '@domain/aggregates/cart.aggregate';
import { CartItem } from '@domain/entities/cart-item.entity';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { AddItemToCartDto } from '@application/dto/request/add-item-to-cart.dto';
import { CartDto } from '@application/dto/response/cart.dto';

@Injectable()
export class AddItemToCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(dto: AddItemToCartDto): Promise<CartDto> {
    // TODO: Get product from Catalog service (gRPC)
    // TODO: Check stock from Inventory service (gRPC)
    // For now, mock product data
    
    const cart = await this.cartRepository.findByUserId(dto.userId) || new Cart(dto.userId);
    
    const item = new CartItem(
      dto.sku,
      dto.quantity,
      99.99, // TODO: Get from catalog service
      'Product Name', // TODO: Get from catalog service
      'image.jpg', // TODO: Get from catalog service
    );
    
    cart.addItem(item);
    await this.cartRepository.save(cart);
    
    return CartDto.fromDomain(cart);
  }
}
