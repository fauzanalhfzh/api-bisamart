import { ApiProperty } from '@nestjs/swagger';
import { MerchantStatus } from '@prisma/client';

export class RegisterMerchantRequest {
  @ApiProperty({ example: 'Kedai Merdeka' })
  name: string;
  @ApiProperty({ example: 'test@example.com' })
  email: string;
  @ApiProperty({ example: '0812345678' })
  phone_number: string;
  @ApiProperty({ example: 'test123' })
  password: string;
  @ApiProperty({ example: '3606762101234' })
  ktp: string;
  @ApiProperty({ example: '' })
  ktp_url: string;
  @ApiProperty({ example: 'Cilegon' })
  place_of_birth: string;
  @ApiProperty({ example: '2024-12-25' })
  date_of_birth: string;
  @ApiProperty({ example: 'Warnasari, lorem ipsum' })
  address_ktp: string;
  @ApiProperty({ example: '' })
  self_photo_url: string;
  @ApiProperty({ example: 'BCA' })
  bank_name: string;
  @ApiProperty({ example: '43221234' })
  account_number: string;
  @ApiProperty({ example: 'John Doe' })
  owner_name: string;
  @ApiProperty({ example: '' })
  category_merchant: string;
  @ApiProperty({ example: 'public/' })
  saving_book_url?: string;
  @ApiProperty({ example: 'Rumah Makan Abang Ipan' })
  merchant_name: string;
  @ApiProperty({ example: 'Jalan Jenderal Sudirman No. 10' })
  address_line: string;
  @ApiProperty({ example: 'Cilegon' })
  city: string;
  @ApiProperty({ example: 'Banten' })
  state: string;
  @ApiProperty({ example: '42415' })
  postal_code: string;
  @ApiProperty({ example: -6.21462 })
  latitude?: number;
  @ApiProperty({ example: 106.84513 })
  longitude?: number;
}

export class LoginMerchantRequest {
  @ApiProperty({ example: 'test@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
}

export class UpdateStatusRequest {
  @ApiProperty({
    example: [MerchantStatus.BUKA, MerchantStatus.TAHAN, MerchantStatus.TUTUP],
  })
  status: MerchantStatus;
}

export class UpdateMerchantRequest {}

export class OperatingHoursRequest {
  merchant_id: string;
  day_of_week: string;
  is_24_hours: boolean;
  open_time: string;
  close_time: string;
}

export class MerchantResponse {
  id: string;
  name: string;
  email: string;
  phone_number: string;

  ktp: string;
  ktp_url: string;
  place_of_birth: string;
  date_of_birth: string;
  address_ktp: string;
  self_photo_url: string;

  bank_name: string;
  account_number: string;
  owner_name: string;
  saving_book_url: string;

  status: MerchantStatus;

  merchant_name: string;
  category_merchant: string;

  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;

  ratings: number;
  total_earning: number;
  total_order: number;
  pending_order: number;
  cancel_order: number;

  created_at: Date;
  updated_at: Date;

  token?: string;
}
