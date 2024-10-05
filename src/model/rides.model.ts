import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class RidesRequest {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  user_id: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440213' })
  driver_id: string;
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440124' })
  coupon_id?: string;
  @ApiProperty({ example: 'Janoor Coffe' })
  current_location_name: string;
  @ApiProperty({ example: 'Cilegon Center Mall' })
  destination_location_name: string;
  @ApiProperty({ example: 4.3 })
  distance: number;
  @ApiProperty({ example: 5 })
  rating?: number;
}

export class UpdateStatusRideRequest {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;
  @ApiProperty({ example: 'ACCEPTED' })
  status: OrderStatus;
}

export class RidesResponse {
  id: string;
  user_id: string;
  driver_id: string;
  coupon_id?: string;
  charge: number;
  current_location_name: string;
  destination_location_name: string;
  distance: number;
  status: OrderStatus;
  rating?: number;
  created_at: Date;
  updated_at: Date;
}
