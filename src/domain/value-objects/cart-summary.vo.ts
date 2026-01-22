export class CartSummary {
  constructor(
    public readonly subtotal: number,
    public readonly tax: number,
    public readonly total: number,
    public readonly itemCount: number,
    public readonly currency: string = 'MAD',
  ) {}

  toJSON() {
    return {
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
      itemCount: this.itemCount,
      currency: this.currency,
    };
  }
}
