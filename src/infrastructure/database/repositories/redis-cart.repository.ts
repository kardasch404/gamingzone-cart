import { Injectable } from '@nestjs/common';
import { RedisService } from '@infrastructure/cache/redis/redis.service';
import { Cart } from '@domain/aggregates/cart.aggregate';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { REDIS_KEYS, CART_CONSTANTS } from '@shared/constants/cart.constants';

@Injectable()
export class RedisCartRepository implements ICartRepository {
  constructor(private readonly redisService: RedisService) {}

  async save(cart: Cart): Promise<void> {
    const key = REDIS_KEYS.CART(cart.userId);
    const client = this.redisService.getClient();
    const cartData = cart.toJSON();

    await client
      .multi()
      .hset(key, 'items', JSON.stringify(cartData.items))
      .hset(key, 'subtotal', cartData.subtotal.toString())
      .hset(key, 'tax', cartData.tax.toString())
      .hset(key, 'total', cartData.total.toString())
      .hset(key, 'itemCount', cartData.itemCount.toString())
      .hset(key, 'currency', cartData.currency)
      .hset(key, 'updatedAt', cartData.updatedAt)
      .expire(key, CART_CONSTANTS.TTL_SECONDS)
      .exec();
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const key = REDIS_KEYS.CART(userId);
    const client = this.redisService.getClient();
    const data = await client.hgetall(key);

    if (!data || !data.items) {
      return null;
    }

    // Refresh TTL on access (sliding window)
    await client.expire(key, CART_CONSTANTS.TTL_SECONDS);

    return Cart.fromJSON({
      userId,
      items: JSON.parse(data.items),
      updatedAt: data.updatedAt,
    });
  }

  async delete(userId: string): Promise<void> {
    const key = REDIS_KEYS.CART(userId);
    await this.redisService.del(key);
  }

  async exists(userId: string): Promise<boolean> {
    const key = REDIS_KEYS.CART(userId);
    return this.redisService.exists(key);
  }
}
