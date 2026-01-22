import { Module } from '@nestjs/common';
import { CartController } from '@presentation/rest/controllers/cart.controller';
import { CartResolver } from '@presentation/graphql/resolvers/cart.resolver';
import { AddItemToCartUseCase } from '@application/use-cases/commands/add-item-to-cart.use-case';
import { UpdateCartItemQuantityUseCase } from '@application/use-cases/commands/update-cart-item-quantity.use-case';
import { RemoveItemFromCartUseCase } from '@application/use-cases/commands/remove-item-from-cart.use-case';
import { ClearCartUseCase } from '@application/use-cases/commands/clear-cart.use-case';
import { ValidateCartForCheckoutUseCase } from '@application/use-cases/commands/validate-cart-for-checkout.use-case';
import { MergeCartUseCase } from '@application/use-cases/commands/merge-cart.use-case';
import { GetCartQuery } from '@application/use-cases/queries/get-cart.query';
import { RedisCartRepository } from '@infrastructure/database/repositories/redis-cart.repository';
import { ICartRepository } from '@application/ports/out/cart-repository.interface';

@Module({
  controllers: [CartController],
  providers: [
    CartResolver,
    {
      provide: ICartRepository,
      useClass: RedisCartRepository,
    },
    AddItemToCartUseCase,
    UpdateCartItemQuantityUseCase,
    RemoveItemFromCartUseCase,
    ClearCartUseCase,
    ValidateCartForCheckoutUseCase,
    MergeCartUseCase,
    GetCartQuery,
  ],
})
export class CartModule {}
