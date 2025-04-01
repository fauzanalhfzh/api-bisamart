import { ApiProperty } from '@nestjs/swagger';
import { DeliveryMethod } from '@prisma/client';

export class CreateProductRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
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
  @ApiProperty({ example: DeliveryMethod.BOTH })
  delivery_method: DeliveryMethod;
  @ApiProperty({ example: 1 })
  merchant_id: number;
  @ApiProperty({ example: 1 })
  category_id: number;
}

export class UpdateProductRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  image?: any;
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
  id: number;
  merchant_id: number;
  category_id: number;

  image: string;
  name: string;
  description: string;
  
  price: number;
  stock: number;
  netto: number;
  discount: number;
  delivery_method: DeliveryMethod;
  
  created_at: Date;
  updated_at: Date;
}
