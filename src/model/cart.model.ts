import { ApiProperty } from '@nestjs/swagger';

export class AddingToCartRequest {
  @ApiProperty({ example: 1 })
  customer_id: number;
  @ApiProperty({ example: 1 })
  product_id: number;
  @ApiProperty({ example: 1 })
  quantity: number;
  @ApiProperty({ example: 'catatan singkat pesanan' })
  note?: string;
}

export class DeleteItemFromCart {
  @ApiProperty({ example: 1 })
  customer_id: number;
  @ApiProperty({ example: 1 })
  product_id: number;
}

export class CartResponse {
  id: number;
  customer_id: number;
  product_id: number;
  quantity: number;
  note: string;
  created_at: Date;
  updated_at: Date;
}
