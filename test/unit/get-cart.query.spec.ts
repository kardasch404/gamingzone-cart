import { GetCartQuery } from '@application/use-cases/queries/get-cart.query';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { Cart } from '@domain/aggregates/cart.aggregate';
import { CartItem } from '@domain/entities/cart-item.entity';

describe('GetCartQuery', () => {
  let query: GetCartQuery;
  let cartRepository: jest.Mocked<ICartRepository>;

  beforeEach(() => {
    cartRepository = {
      save: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };
    query = new GetCartQuery(cartRepository);
  });

  it('should return null for non-existent cart', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);

    const result = await query.execute('user123');

    expect(result).toBeNull();
  });

  it('should return cart for existing user', async () => {
    const cart = new Cart('user123');
    cart.addItem(new CartItem('SKU123', 2, 99.99, 'Product'));
    cartRepository.findByUserId.mockResolvedValue(cart);

    const result = await query.execute('user123');

    expect(result).not.toBeNull();
    expect(result.userId).toBe('user123');
    expect(result.items.length).toBe(1);
  });

  it('should create empty cart if not exists', async () => {
    cartRepository.findByUserId.mockResolvedValue(null);

    const result = await query.getOrCreate('user123');

    expect(result.userId).toBe('user123');
    expect(result.items.length).toBe(0);
  });
});
