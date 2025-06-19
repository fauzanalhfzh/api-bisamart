import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  AddingToCartRequest,
  CartResponse,
  DeleteItemFromCart,
} from 'src/model/cart.model';
import { Logger } from 'winston';
import { CartValidation } from './cart.validation';

@Injectable()
export class CartService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toCartResponse(cart: Cart): CartResponse {
    const cartResponse: CartResponse = {
      id: cart.id,
      customer_id: cart.customer_id,
      product_id: cart.product_id,
      quantity: cart.quantity,
      note: cart.note,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
    };

    return cartResponse;
  }

  async addToCart(
    user: User,
    request: AddingToCartRequest,
  ): Promise<CartResponse> {
    const cartRequest: AddingToCartRequest = this.validationService.validate(
      CartValidation.ADDINGTOCART,
      request,
    );

    const product = await this.prismaService.product.findFirst({
      where: {
        id: cartRequest.product_id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    const existingCart = await this.prismaService.cart.findFirst({
      where: {
        customer_id: cartRequest.customer_id,
        product_id: cartRequest.product_id,
      },
    });

    let cart: Cart;

    if (existingCart) {
      cart = await this.prismaService.cart.update({
        where: {
          id: existingCart.id,
        },
        data: {
          quantity: existingCart.quantity + cartRequest.quantity,
          note: cartRequest.note ?? existingCart.note,
        },
      });
    } else {
      cart = await this.prismaService.cart.create({
        data: cartRequest,
      });
    }

    this.logger.info(
      `Added to cart: customer=${cartRequest.customer_id}, product=${cartRequest.product_id}`,
    );
    return this.toCartResponse(cart);
  }

  async DeleteItemFromCart(
    user: User,
    request: DeleteItemFromCart,
  ): Promise<void> {
    const cartRequest: DeleteItemFromCart = this.validationService.validate(
      CartValidation.DELETEITEM,
      request,
    );

    const cartItem = await this.prismaService.cart.findFirst({
      where: {
        customer_id: cartRequest.customer_id,
        product_id: cartRequest.product_id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.prismaService.cart.delete({
      where: { id: cartItem.id },
    });

    this.logger.info(
      `Deleted item from cart: customer=${cartRequest.customer_id}, product=${cartRequest.product_id}`,
    );
  }
}
