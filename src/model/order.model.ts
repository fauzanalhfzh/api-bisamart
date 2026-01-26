import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CreateOrderResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    total_amount: number;

    @ApiProperty()
    status: OrderStatus;

    @ApiProperty()
    snap_token: string;

    @ApiProperty()
    snap_redirect_url: string;
}
