import { ApiProperty } from '@nestjs/swagger';
import { StatusDriver, VehicleType } from '@prisma/client';

export class RegisterDriverRequest {
  @ApiProperty({ example: 'Zen driver' })
  name: string;
  @ApiProperty({ example: '0812345' })
  phone_number: string;
  @ApiProperty({ example: 'zen@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
  @ApiProperty({ example: 'Indonesia' })
  country: string;
  @ApiProperty({ example: '3606762101234' })
  ktp: string;
  @ApiProperty({ example: 'Jl. pasti cepat sampai' })
  address_ktp: string;
  @ApiProperty({ example: 'SID3606762101234.png' })
  ktp_img: string;
  @ApiProperty({ example: VehicleType.MOTOR, enum: VehicleType })
  vehicle_type: VehicleType;
  @ApiProperty({ example: '720612346543' })
  sim: string;
  @ApiProperty({ example: 'SIM3606762101234.png' })
  sim_img: string;
  @ApiProperty({ example: 'SEIM3606762101234.png' })
  selfie_with_sim: string;
  @ApiProperty({ example: 'Honda Beat' })
  vehicle_brand: string;
  @ApiProperty({ example: 'Biru Putih' })
  vehicle_color: string;
  @ApiProperty({ example: 'DM 1243 AR' })
  license_plate: string;
  @ApiProperty({ example: '4546221234822' })
  registration_number: string;
  @ApiProperty({ example: 'PIM3606762101234.png' })
  profile_img: string;
}

export class LoginDriverRequest {
  @ApiProperty({ example: 'zen@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
}

export class UpdateStatusRequest {
  @ApiProperty({ example: 'ACTIVE' })
  status: StatusDriver;
}

export class DriverResponse {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  country: string;
  ktp: string;
  address_ktp: string;
  ktp_img: string;
  vehicle_type: VehicleType;
  sim: string;
  sim_img: string;
  selfie_with_sim: string;
  vehicle_brand: string;
  vehicle_color: string;
  license_plate: string;
  registration_number: string;
  profile_img: string;
  ratings: number;
  total_earning: number;
  total_rides: number;
  pending_rides: number;
  cancel_rides: number;
  status: StatusDriver;
  created_at: Date;
  updated_at: Date;
  token?: string;
}
