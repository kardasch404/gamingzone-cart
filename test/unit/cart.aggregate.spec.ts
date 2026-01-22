import { Cart } from '@domain/aggregates/cart.aggregate';
import { CartItem } from '@domain/entities/cart-item.entity';
import { CartLimitExceededException, ItemNotFoundException } from '@domain/exceptions/cart.exceptions';

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart('user123');
  });

  it('should create empty cart', () => {
    expect(cart.isEmpty()).toBe(true);
    expect(cart.getItemCount()).toBe(0);
  });

  it('should add item to cart', () => {
    const item = new CartItem('SKU123', 2, 99.99, 'Product');
    cart.addItem(item);
    expect(cart.getItems().length).toBe(1);
    expect(cart.getItemCount()).toBe(2);
  });

  it('should merge quantities when adding same item', () => {
    const item1 = new CartItem('SKU123', 2, 99.99, 'Product');
    const item2 = new CartItem('SKU123', 3, 99.99, 'Product');
    cart.addItem(item1);
    cart.addItem(item2);
    expect(cart.getItems().length).toBe(1);
    expect(cart.getItems()[0].quantity).toBe(5);
  });

  it('should cap quantity at 10 when merging', () => {
    const item1 = new CartItem('SKU123', 8, 99.99, 'Product');
    const item2 = new CartItem('SKU123', 5, 99.99, 'Product');
    cart.addItem(item1);
    cart.addItem(item2);
    expect(cart.getItems()[0].quantity).toBe(10);
  });

  it('should throw error when exceeding max items', () => {
    for (let i = 0; i < 20; i++) {
      cart.addItem(new CartItem(`SKU${i}`, 1, 10, 'Product'));
    }
    expect(() => cart.addItem(new CartItem('SKU21', 1, 10, 'Product'))).toThrow(CartLimitExceededException);
  });

  it('should remove item from cart', () => {
    const item = new CartItem('SKU123', 2, 99.99, 'Product');
    cart.addItem(item);
    cart.removeItem('SKU123');
    expect(cart.isEmpty()).toBe(true);
  });

  it('should throw error when removing non-existent item', () => {
    expect(() => cart.removeItem('SKU999')).toThrow(ItemNotFoundException);
  });

  it('should update item quantity', () => {
    const item = new CartItem('SKU123', 2, 99.99, 'Product');
    cart.addItem(item);
    cart.updateItemQuantity('SKU123', 5);
    expect(cart.getItems()[0].quantity).toBe(5);
  });

  it('should calculate subtotal', () => {
    cart.addItem(new CartItem('SKU1', 2, 50, 'Product1'));
    cart.addItem(new CartItem('SKU2', 1, 100, 'Product2'));
    expect(cart.getSubtotal()).toBe(200);
  });

  it('should calculate total', () => {
    cart.addItem(new CartItem('SKU1', 2, 50, 'Product1'));
    expect(cart.getTotal()).toBe(100);
  });

  it('should clear cart', () => {
    cart.addItem(new CartItem('SKU123', 2, 99.99, 'Product'));
    cart.clear();
    expect(cart.isEmpty()).toBe(true);
  });

  it('should serialize to JSON', () => {
    cart.addItem(new CartItem('SKU123', 2, 99.99, 'Product'));
    const json = cart.toJSON();
    expect(json.userId).toBe('user123');
    expect(json.items.length).toBe(1);
    expect(json.subtotal).toBe(199.98);
  });

  it('should deserialize from JSON', () => {
    const json = {
      userId: 'user123',
      items: [{ sku: 'SKU123', quantity: 2, price: 99.99, name: 'Product' }],
      updatedAt: new Date().toISOString(),
    };
    const restoredCart = Cart.fromJSON(json);
    expect(restoredCart.userId).toBe('user123');
    expect(restoredCart.getItems().length).toBe(1);
  });
});
