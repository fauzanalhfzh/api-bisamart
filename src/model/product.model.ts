import { ApiProperty } from '@nestjs/swagger';

export class CreateProductRequest {
  @ApiProperty({ example: 'Paku 7cm' })
  product_name: string;
  @ApiProperty({ example: '1 kg khusus kayu' })
  description?: string;
  @ApiProperty({ example: 15000 })
  price: number;
  @ApiProperty({ example: 10 })
  stock: number;
  @ApiProperty({ example: 'b4cd5cf0-3a75-42b6-a2e1-de1999f26114' })
  merchant_id: string;
}

export class UpdateProductRequest {
  @ApiProperty({ example: 'Paku 9cm' })
  product_name?: string;
  @ApiProperty({ example: '2 kg khusus kayu' })
  description?: string;
  @ApiProperty({ example: 19000 })
  price?: number;
  @ApiProperty({ example: 35 })
  stock?: number;
}

export class ProductResponse {
  id: string;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  merchant_id: string;
  created_at: Date;
  updated_at: Date;
}
