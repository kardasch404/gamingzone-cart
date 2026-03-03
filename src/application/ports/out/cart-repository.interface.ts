import { Cart } from '@domain/aggregates/cart.aggregate';

export interface ICartRepository {
  save(cart: Cart): Promise<void>;
  findByUserId(userId: string): Promise<Cart | null>;
  delete(userId: string): Promise<void>;
  exists(userId: string): Promise<boolean>;
}
