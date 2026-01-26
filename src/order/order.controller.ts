import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { WebResponse } from '../model/web.model';
import { CreateOrderResponse } from '../model/order.model';
import { CheckoutOrderRequest } from '../model/order_request.model';

@ApiTags('Orders')
@Controller('/api/v1/orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post('/checkout')
    @HttpCode(200)
    @ApiSecurity('Authorization')
    @ApiOperation({ summary: 'Checkout All Cart Items' })
    async checkout(
        @Auth() user: User,
        @Body() request: CheckoutOrderRequest,
    ): Promise<WebResponse<CreateOrderResponse>> {
        const result = await this.orderService.checkout(user, request);
        return {
            data: result,
        };
    }

    @Post('/notification')
    @HttpCode(200)
    @ApiOperation({ summary: 'Webhook for Midtrans Notification' })
    async notification(@Body() payload: any) {
        return this.orderService.handleNotification(payload);
    }

    @Get('/merchant')
    @HttpCode(200)
    @ApiSecurity('Authorization')
    @ApiOperation({ summary: 'Get Merchant Orders' })
    async getMerchantOrders(@Auth() user: User) {
        const result = await this.orderService.getMerchantOrders(user);
        return {
            data: result
        };
    }

    @Get('/courier')
    @HttpCode(200)
    @ApiSecurity('Authorization')
    @ApiOperation({ summary: 'Get Courier Orders (Info for Pickup)' })
    async getCourierOrders(@Auth() user: User) {
        const result = await this.orderService.getCourierOrders(user);
        return {
            data: result
        };
    }
}
