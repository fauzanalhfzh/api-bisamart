import { ApiProperty } from '@nestjs/swagger';
import { RidesStatus } from '@prisma/client';

export class RidesRequest {
  @ApiProperty({ example: 1 })
  user_id: number;
  @ApiProperty({ example: 1 })
  driver_id: number;
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
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'ACCEPTED' })
  status: RidesStatus;
}

export class RidesResponse {
  id: number;
  user_id: number;
  driver_id: number;
  charge: number;
  current_location_name: string;
  destination_location_name: string;
  distance: number;
  status: RidesStatus;
  rating?: number;
  created_at: Date;
  updated_at: Date;
}

