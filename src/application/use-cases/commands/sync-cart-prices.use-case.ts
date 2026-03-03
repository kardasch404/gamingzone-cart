import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '@infrastructure/cache/redis/redis.service';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';
import { Logger } from '@shared/utils/logger.util';

@Injectable()
export class SyncCartPricesUseCase {
  private logger = new Logger('SyncCartPrices');

  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly redisService: RedisService,
  ) {}

  @Cron('0 */30 * * * *') // Every 30 minutes
  async syncAllCartPrices(): Promise<void> {
    this.logger.log('Starting cart price synchronization');

    try {
      const client = this.redisService.getClient();
      const cartKeys = await client.keys('cart:*');

      this.logger.log(`Found ${cartKeys.length} carts to sync`);

      for (const key of cartKeys) {
        const userId = key.split(':')[1];
        await this.syncCartPrice(userId);
      }

      this.logger.log('Cart price synchronization completed');
    } catch (error) {
      this.logger.error('Error syncing cart prices', error);
    }
  }

  async syncCartPrice(userId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      return;
    }

    // TODO: Fetch latest prices from Catalog service (gRPC)
    // TODO: Update cart items with new prices
    // TODO: Notify user via WebSocket if prices changed

    await this.cartRepository.save(cart);
  }
}
