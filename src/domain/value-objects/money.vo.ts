export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'MAD',
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
