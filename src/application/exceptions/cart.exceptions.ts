export class ApplicationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationException';
  }
}

export class ProductNotAvailableException extends ApplicationException {
  constructor() {
    super('Product is not available');
  }
}

export class InsufficientStockException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class CartNotFoundException extends ApplicationException {
  constructor(userId: string) {
    super(`Cart not found for user ${userId}`);
  }
}
