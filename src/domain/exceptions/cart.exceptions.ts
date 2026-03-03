export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class CartLimitExceededException extends DomainException {
  constructor() {
    super('Cart cannot exceed 20 items');
  }
}

export class InvalidQuantityException extends DomainException {
  constructor() {
    super('Quantity must be between 1 and 10');
  }
}

export class ItemNotFoundException extends DomainException {
  constructor(sku: string) {
    super(`Item with SKU ${sku} not found in cart`);
  }
}
