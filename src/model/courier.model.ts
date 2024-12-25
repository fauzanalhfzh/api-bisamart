import { ApiProperty } from '@nestjs/swagger';
import { KurirStatus } from '@prisma/client';

export class RegisterCourierRequest {
  @ApiProperty({ example: 'John Doe' })
  name: string;
  @ApiProperty({ example: 'test@example.com' })
  email: string;
  @ApiProperty({ example: '0812345678' })
  phone_number: string;
  @ApiProperty({ example: 'test123' })
  password: string;
  @ApiProperty({
    example: 'Jl Brigjen Slamet Riyadi 40 RT 001/04, Jawa Tengah',
  })
  address_ktp: string;
  @ApiProperty({ example: '3606762101234' })
  ktp: string;
  @ApiProperty({ example: '' })
  ktp_url: string;
  @ApiProperty({ example: '' })
  selfie_with_sim_url: string;
  @ApiProperty({ example: '' })
  profile_url: string;
  @ApiProperty({ example: 'Honda Beat' })
  vehicle_brand: string;
  @ApiProperty({ example: 'Biru Putih' })
  vehicle_color: string;
  @ApiProperty({ example: 'Biru Putih' })
  vehicle_speed: number;
  @ApiProperty({ example: '4546221234822' })
  registration_number: string;
  @ApiProperty({ example: 'DM 1243 AR' })
  license_plate: string;
  @ApiProperty({ example: '' })
  license_url: string;
}

export class LoginCourierRequest {
  @ApiProperty({ example: 'test@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
}

export class UpdateStatusRequest {
  @ApiProperty({ example: 'ONLINE' })
  status: KurirStatus;
}

export class CourierResponse {
  id: string;
  name: string;
  email: string;
  phone_number: string;

  address_ktp: string;
  ktp: string;
  ktp_url: string;
  selfie_with_sim_url: string;
  profile_url: string;

  vehicle_brand: string;
  vehicle_color: string;
  vehicle_speed: number;

  registration_number: string;
  license_plate: string;
  license_url: string;

  status: KurirStatus;

  ratings: number;
  total_earning: number;
  total_rides: number;
  pending_rides: number;
  cancel_rides: number;
  created_at: Date;
  updated_at: Date;

  token?: string;
}
