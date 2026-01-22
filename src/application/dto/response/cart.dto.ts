import { Cart } from '@domain/aggregates/cart.aggregate';

export class CartItemDto {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  subtotal: number;
}

export class CartDto {
  userId: string;
  items: CartItemDto[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  currency: string;
  updatedAt: string;

  static fromDomain(cart: Cart): CartDto {
    const dto = new CartDto();
    const cartData = cart.toJSON();
    
    dto.userId = cartData.userId;
    dto.items = cartData.items.map(item => ({
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      subtotal: item.price * item.quantity,
    }));
    dto.subtotal = cartData.subtotal;
    dto.tax = cartData.tax;
    dto.total = cartData.total;
    dto.itemCount = cartData.itemCount;
    dto.currency = cartData.currency;
    dto.updatedAt = cartData.updatedAt;
    
    return dto;
  }
}
