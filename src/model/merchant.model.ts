import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, MerchantStatus } from '@prisma/client';

export class RegisterMerchantRequest {
  @ApiProperty({ example: 1 })
  merchant_category_id: number;
  @ApiProperty({ example: '3606762101234' })
  ktp: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  ktp_photo: any;
  @ApiProperty({ example: 'Cilegon' })
  place_of_birth: string;
  @ApiProperty({ example: '2024-12-25' })
  date_of_birth: string;
  @ApiProperty({ example: 'Warnasari, lorem ipsum' })
  address_ktp: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  self_photo: any;
  @ApiProperty({ example: 'BCA' })
  bank_name: string;
  @ApiProperty({ example: '43221234' })
  account_number: string;
  @ApiProperty({ example: 'John Doe' })
  owner_name: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  saving_book_photo: any;
  @ApiProperty({ example: 'Rumah Makan Abang Ipan' })
  merchant_name: string;
}

export class LoginMerchantRequest {
  @ApiProperty({ example: 'test@example.com' })
  phone_number: string;
  @ApiProperty({ example: 'test123' })
  password: string;
}

export class MerchantOperatingHoursRequest {
  @ApiProperty({ example: 1 })
  merchant_id: number;
  @ApiProperty({ example: DayOfWeek.SENIN })
  day_of_week: DayOfWeek;
  @ApiProperty({ example: true })
  is_24_hours: boolean;
  @ApiProperty({ example: "08.00" })
  open_time?: string;
  @ApiProperty({ example: "22.00" })
  close_time?: string;
}

export class UpdateStatusRequest {
  @ApiProperty({
    enum: MerchantStatus, 
    example: MerchantStatus.BUKA,
  })
  status: MerchantStatus;
}

export class UpdateMerchantRequest {}

export class MerchantResponse {
  id: number;
  user_id: number;
  merchant_category_id: number;
  
  ktp: string;
  ktp_photo: string;
  place_of_birth: string;
  date_of_birth: Date;
  address_ktp: string;
  self_photo: string;

  bank_name: string;
  account_number: string;
  owner_name: string;
  saving_book_photo: string;

  status: MerchantStatus;

  merchant_name: string;

  ratings: number;
  total_earning: number;
  total_order: number;
  pending_order: number;
  cancel_order: number;

  created_at: Date;
  updated_at: Date;
}

export class MerchantOperatingHoursResponse {
  id: number;
  merchant_id: number;
  day_of_week: DayOfWeek;
  is_24_hours: boolean;
  open_time: string;
  close_time: string;
  created_at: Date;
  updated_at: Date;
}
