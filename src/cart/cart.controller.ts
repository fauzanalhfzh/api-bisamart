import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { AddingToCartRequest, DeleteItemFromCart } from 'src/model/cart.model';
import { WebResponse } from 'src/model/web.model';
import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller('/api/v1/users')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('/cart/add')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Add item to cart' })
  async create(
    @Auth() user: User,
    @Body() request: AddingToCartRequest,
  ): Promise<WebResponse<AddingToCartRequest>> {
    const result = await this.cartService.addToCart(user, request);
    return {
      data: result,
    };
  }

  @Delete('/cart/delete')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Delete item to cart' })
  async delete(
    @Auth() user: User,
    @Body() request: DeleteItemFromCart,
  ): Promise<WebResponse<boolean>> {
    await this.cartService.DeleteItemFromCart(user, request);
    return {
      data: true,
    };
  }
}
