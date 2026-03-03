import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddItemToCartUseCase } from '@application/use-cases/commands/add-item-to-cart.use-case';
import { UpdateCartItemQuantityUseCase } from '@application/use-cases/commands/update-cart-item-quantity.use-case';
import { RemoveItemFromCartUseCase } from '@application/use-cases/commands/remove-item-from-cart.use-case';
import { ClearCartUseCase } from '@application/use-cases/commands/clear-cart.use-case';
import { ValidateCartForCheckoutUseCase } from '@application/use-cases/commands/validate-cart-for-checkout.use-case';
import { MergeCartUseCase } from '@application/use-cases/commands/merge-cart.use-case';
import { GetCartQuery } from '@application/use-cases/queries/get-cart.query';
import { AddItemToCartDto } from '@application/dto/request/add-item-to-cart.dto';
import { UpdateCartItemDto } from '@application/dto/request/update-cart-item.dto';
import { MergeCartDto } from '@application/dto/request/merge-cart.dto';
import { CartDto } from '@application/dto/response/cart.dto';

@ApiTags('cart')
@Controller('api/cart')
export class CartController {
  constructor(
    private readonly addItemUseCase: AddItemToCartUseCase,
    private readonly updateItemUseCase: UpdateCartItemQuantityUseCase,
    private readonly removeItemUseCase: RemoveItemFromCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
    private readonly validateCartUseCase: ValidateCartForCheckoutUseCase,
    private readonly mergeCartUseCase: MergeCartUseCase,
    private readonly getCartQuery: GetCartQuery,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved', type: CartDto })
  async getCart(@Body('userId') userId: string): Promise<CartDto> {
    return this.getCartQuery.getOrCreate(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added', type: CartDto })
  async addItem(@Body() dto: AddItemToCartDto): Promise<CartDto> {
    return this.addItemUseCase.execute(dto);
  }

  @Patch('items/:sku')
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiResponse({ status: 200, description: 'Item updated', type: CartDto })
  async updateItem(
    @Param('sku') sku: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartDto> {
    return this.updateItemUseCase.execute({ ...dto, sku });
  }

  @Delete('items/:sku')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed', type: CartDto })
  async removeItem(
    @Param('sku') sku: string,
    @Body('userId') userId: string,
  ): Promise<CartDto> {
    return this.removeItemUseCase.execute({ userId, sku });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared' })
  async clearCart(@Body('userId') userId: string): Promise<void> {
    return this.clearCartUseCase.execute(userId);
  }

  @Post('merge')
  @ApiOperation({ summary: 'Merge guest cart with user cart' })
  @ApiResponse({ status: 200, description: 'Carts merged', type: CartDto })
  async mergeCart(@Body() dto: MergeCartDto): Promise<CartDto> {
    return this.mergeCartUseCase.execute(dto);
  }
}
