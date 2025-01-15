import { ApiProperty } from '@nestjs/swagger';

export class CreateProductRequest {
  @ApiProperty({ example: '' })
  image_url: string;
  @ApiProperty({ example: 'Paku 7cm' })
  name: string;
  @ApiProperty({ example: '1 kg khusus kayu' })
  description?: string;
  @ApiProperty({ example: 15000 })
  price: number;
  @ApiProperty({ example: 10 })
  stock: number;
  @ApiProperty({ example: 2 })
  netto: number;
  @ApiProperty({ example: 10 })
  discount: number;
  @ApiProperty({ example: 'b4cd5cf0-3a75-42b6-a2e1-de1999f26114' })
  merchant_id: string;
  @ApiProperty({ example: 'b4cd5cf0-3a75-42b6-a2e1-de1999f26114' })
  category_id: string;
}

export class UpdateProductRequest {
  @ApiProperty({ example: '' })
  image_url?: string;
  @ApiProperty({ example: 'Paku 9cm' })
  name?: string;
  @ApiProperty({ example: '2 kg khusus kayu' })
  description?: string;
  @ApiProperty({ example: 19000 })
  price?: number;
  @ApiProperty({ example: 35 })
  stock?: number;
  @ApiProperty({ example: 2 })
  netto?: number;
  @ApiProperty({ example: 10 })
  discount?: number;
  @ApiProperty({ example: 10 })
  category_id?: number;
}

export class ProductResponse {
  id: string;
  image_url: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  netto: number;
  discount: number;
  merchant_id: string;
  category_id: string;
  created_at: Date;
  updated_at: Date;
}
