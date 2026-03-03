export class CartItem {
  constructor(
    public readonly sku: string,
    public quantity: number,
    public readonly price: number,
    public readonly name: string,
    public readonly image?: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.quantity < 1 || this.quantity > 10) {
      throw new Error('Quantity must be between 1 and 10');
    }
    if (this.price < 0) {
      throw new Error('Price cannot be negative');
    }
  }

  updateQuantity(quantity: number): void {
    this.quantity = quantity;
    this.validate();
  }

  getSubtotal(): number {
    return this.price * this.quantity;
  }

  toJSON() {
    return {
      sku: this.sku,
      quantity: this.quantity,
      price: this.price,
      name: this.name,
      image: this.image,
    };
  }
}
