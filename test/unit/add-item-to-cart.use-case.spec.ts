import { AddItemToCartUseCase } from '@application/use-cases/commands/add-item-to-cart.use-case';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { Cart } from '@domain/aggregates/cart.aggregate';

describe('AddItemToCartUseCase', () => {
  let useCase: AddItemToCartUseCase;
  let cartRepository: jest.Mocked<ICartRepository>;

  beforeEach(() => {
    cartRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };
    useCase = new AddItemToCartUseCase(cartRepository);
  });

  it('should add item to new cart', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);

    const result = await useCase.execute({
      userId: 'user123',
      sku: 'SKU123',
      quantity: 2,
    });

    expect(result.userId).toBe('user123');
    expect(result.items.length).toBe(1);
    expect(cartRepository.save).toHaveBeenCalled();
  });

  it('should add item to existing cart', async () => {
    const existingCart = new Cart('user123');
    cartRepository.findByUserId.mockResolvedValue(existingCart);

    const result = await useCase.execute({
      userId: 'user123',
      sku: 'SKU123',
      quantity: 2,
    });

    expect(result.items.length).toBe(1);
    expect(cartRepository.save).toHaveBeenCalled();
  });
});
