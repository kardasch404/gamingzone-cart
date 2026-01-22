import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CartType } from '@application/dto/graphql/cart.type';
import { AddItemToCartUseCase } from '@application/use-cases/commands/add-item-to-cart.use-case';
import { UpdateCartItemQuantityUseCase } from '@application/use-cases/commands/update-cart-item-quantity.use-case';
import { RemoveItemFromCartUseCase } from '@application/use-cases/commands/remove-item-from-cart.use-case';
import { ClearCartUseCase } from '@application/use-cases/commands/clear-cart.use-case';
import { GetCartQuery } from '@application/use-cases/queries/get-cart.query';

@Resolver(() => CartType)
export class CartResolver {
  constructor(
    private readonly addItemUseCase: AddItemToCartUseCase,
    private readonly updateItemUseCase: UpdateCartItemQuantityUseCase,
    private readonly removeItemUseCase: RemoveItemFromCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
    private readonly getCartQuery: GetCartQuery,
  ) {}

  @Query(() => CartType, { name: 'myCart' })
  async getMyCart(@Args('userId') userId: string): Promise<CartType> {
    return this.getCartQuery.getOrCreate(userId) as any;
  }

  @Mutation(() => CartType)
  async addItemToCart(
    @Args('userId') userId: string,
    @Args('sku') sku: string,
    @Args('quantity', { type: () => Int }) quantity: number,
  ): Promise<CartType> {
    return this.addItemUseCase.execute({ userId, sku, quantity }) as any;
  }

  @Mutation(() => CartType)
  async updateCartItemQuantity(
    @Args('userId') userId: string,
    @Args('sku') sku: string,
    @Args('quantity', { type: () => Int }) quantity: number,
  ): Promise<CartType> {
    return this.updateItemUseCase.execute({ userId, sku, quantity }) as any;
  }

  @Mutation(() => CartType)
  async removeCartItem(
    @Args('userId') userId: string,
    @Args('sku') sku: string,
  ): Promise<CartType> {
    return this.removeItemUseCase.execute({ userId, sku }) as any;
  }

  @Mutation(() => Boolean)
  async clearCart(@Args('userId') userId: string): Promise<boolean> {
    await this.clearCartUseCase.execute(userId);
    return true;
  }
}
