import { Injectable } from '@nestjs/common';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { CartNotFoundException } from '@application/exceptions/cart.exceptions';

export class CartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];

  constructor() {
    this.isValid = true;
    this.errors = [];
    this.warnings = [];
  }

  addError(error: string): void {
    this.errors.push(error);
    this.isValid = false;
  }

  addWarning(warning: string): void {
    this.warnings.push(warning);
  }
}

@Injectable()
export class ValidateCartForCheckoutUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<CartValidationResult> {
    const result = new CartValidationResult();
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      throw new CartNotFoundException(userId);
    }

    // Validate cart is not empty
    if (cart.isEmpty()) {
      result.addError('Cart is empty');
      return result;
    }

    // TODO: Validate stock availability for all items (gRPC)
    // TODO: Validate product availability (gRPC)
    // TODO: Validate prices are up-to-date
    // TODO: Check for any promotional restrictions

    const items = cart.getItems();
    for (const item of items) {
      // Mock validation
      if (item.quantity > 10) {
        result.addError(`Item ${item.sku} exceeds maximum quantity`);
      }
    }

    return result;
  }
}
