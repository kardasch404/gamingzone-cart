import { CartItem } from '@domain/entities/cart-item.entity';

describe('CartItem', () => {
  it('should create a cart item', () => {
    const item = new CartItem('SKU123', 2, 99.99, 'Product Name', 'image.jpg');
    expect(item.sku).toBe('SKU123');
    expect(item.quantity).toBe(2);
    expect(item.price).toBe(99.99);
  });

  it('should calculate subtotal', () => {
    const item = new CartItem('SKU123', 3, 50, 'Product');
    expect(item.getSubtotal()).toBe(150);
  });

  it('should throw error for invalid quantity', () => {
    expect(() => new CartItem('SKU123', 0, 50, 'Product')).toThrow();
    expect(() => new CartItem('SKU123', 11, 50, 'Product')).toThrow();
  });

  it('should update quantity', () => {
    const item = new CartItem('SKU123', 2, 50, 'Product');
    item.updateQuantity(5);
    expect(item.quantity).toBe(5);
  });
});
