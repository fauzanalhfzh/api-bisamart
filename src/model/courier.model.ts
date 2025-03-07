import { ApiProperty } from '@nestjs/swagger';
import { CourierStatus } from '@prisma/client';

export class RegisterCourierRequest {
  @ApiProperty({ example: '2024-12-25' })
  date_of_birth: string;
  @ApiProperty({ example: 'Warnasari, lorem ipsum' })
  address_ktp: string;
  @ApiProperty({ example: '3606762101234' })
  ktp: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  ktp_photo: any;
  @ApiProperty({ type: 'string', format: 'binary' })
  selfie_with_sim_photo: any;
  @ApiProperty({ type: 'string', format: 'binary' })
  profile_photo: any;
  @ApiProperty({ example: 'Honda' })
  vehicle_brand: string;
  @ApiProperty({ example: 'Merah Putih' })
  vehicle_color: string;
  @ApiProperty({ example: 125 })
  vehicle_speed: number;
  @ApiProperty({ example: '081239180313' })
  registration_number: string;
  @ApiProperty({ example: 'A 1234 BC' })
  license_plate: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  license_photo: any;
}

export class UpdateStatusRequest {
  @ApiProperty({ example: 'ONLINE' })
  status: CourierStatus;
}

export class CourierResponse {
  id: number;
  user_id: number;

  date_of_birth: Date;
  address_ktp: string;
  ktp: string;
  ktp_photo: string;
  selfie_with_sim_photo: string;
  profile_photo: string;

  vehicle_brand: string;
  vehicle_color: string;
  vehicle_speed: number;

  registration_number: string;
  license_plate: string;
  license_photo: string;

  status: CourierStatus;

  ratings: number;
  total_earning: number;
  total_rides: number;
  pending_rides: number;
  cancel_rides: number;
  created_at: Date;
  updated_at: Date;

}
