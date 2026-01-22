import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { Cart } from '@domain/aggregates/cart.aggregate';
import { generateId } from '@shared/utils/uuid.util';

@Injectable()
export class PrismaCartBackupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async backup(cart: Cart): Promise<void> {
    const cartData = cart.toJSON();
    
    const existing = await this.prisma.cartBackup.findUnique({
      where: { userId: cart.userId },
    });

    if (existing) {
      await this.prisma.cartBackup.update({
        where: { userId: cart.userId },
        data: {
          items: cartData.items,
          subtotal: cartData.subtotal,
          total: cartData.total,
          lastSyncAt: new Date(),
        },
      });
    } else {
      await this.prisma.cartBackup.create({
        data: {
          id: generateId(),
          userId: cart.userId,
          items: cartData.items,
          subtotal: cartData.subtotal,
          total: cartData.total,
          currency: cartData.currency,
          lastSyncAt: new Date(),
        },
      });
    }
  }

  async restore(userId: string): Promise<Cart | null> {
    const backup = await this.prisma.cartBackup.findUnique({
      where: { userId },
    });

    if (!backup) {
      return null;
    }

    return Cart.fromJSON({
      userId: backup.userId,
      items: backup.items,
      updatedAt: backup.lastSyncAt,
    });
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.cartBackup.delete({
      where: { userId },
    });
  }
}
