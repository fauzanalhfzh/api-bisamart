import { ApiProperty } from '@nestjs/swagger';

export class CheckoutOrderRequest {
    @ApiProperty()
    address_id: number;
}
