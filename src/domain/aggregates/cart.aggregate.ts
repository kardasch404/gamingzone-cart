import { CartItem } from '@domain/entities/cart-item.entity';
import { CartLimitExceededException, ItemNotFoundException } from '@domain/exceptions/cart.exceptions';

export class Cart {
  private items: Map<string, CartItem> = new Map();
  private readonly maxItems = 20;
  public readonly currency = 'MAD';
  public updatedAt: Date;

  constructor(public readonly userId: string) {
    this.updatedAt = new Date();
  }

  addItem(item: CartItem): void {
    const existing = this.items.get(item.sku);
    
    if (existing) {
      const newQuantity = existing.quantity + item.quantity;
      if (newQuantity > 10) {
        existing.updateQuantity(10);
      } else {
        existing.updateQuantity(newQuantity);
      }
    } else {
      if (this.items.size >= this.maxItems) {
        throw new CartLimitExceededException();
      }
      this.items.set(item.sku, item);
    }
    
    this.updatedAt = new Date();
  }

  removeItem(sku: string): void {
    if (!this.items.has(sku)) {
      throw new ItemNotFoundException(sku);
    }
    this.items.delete(sku);
    this.updatedAt = new Date();
  }

  updateItemQuantity(sku: string, quantity: number): void {
    const item = this.items.get(sku);
    if (!item) {
      throw new ItemNotFoundException(sku);
    }
    item.updateQuantity(quantity);
    this.updatedAt = new Date();
  }

  clear(): void {
    this.items.clear();
    this.updatedAt = new Date();
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  getItemCount(): number {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.getItems().reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  getTax(): number {
    return 0; // Morocco VAT 20%, but configurable
  }

  getTotal(): number {
    return this.getSubtotal() + this.getTax();
  }

  isEmpty(): boolean {
    return this.items.size === 0;
  }

  toJSON() {
    return {
      userId: this.userId,
      items: this.getItems().map(item => item.toJSON()),
      subtotal: this.getSubtotal(),
      tax: this.getTax(),
      total: this.getTotal(),
      itemCount: this.getItemCount(),
      currency: this.currency,
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  static fromJSON(data: any): Cart {
    const cart = new Cart(data.userId);
    data.items?.forEach((itemData: any) => {
      const item = new CartItem(
        itemData.sku,
        itemData.quantity,
        itemData.price,
        itemData.name,
        itemData.image,
      );
      cart.items.set(item.sku, item);
    });
    cart.updatedAt = new Date(data.updatedAt);
    return cart;
  }
}
