import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class RegisterMerchantRequest {
  @ApiProperty({ example: 'Tri tunggal' })
  name: string;
  @ApiProperty({ example: '0812345678' })
  phone_number: string;
  @ApiProperty({ example: 'test@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
  @ApiProperty({ example: 'Kedai Merdeka' })
  merchant_name: string;
  @ApiProperty({ example: 'Jalan pasti ketemu lagi' })
  address: string;
  @ApiProperty({ example: '15:00' })
  open_time: string;
  @ApiProperty({ example: '22:00' })
  close_time: string;
}
export class LoginMerchantRequest {
  @ApiProperty({ example: 'test@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
}

export class UpdateStatusRequest {
  @ApiProperty({ example: 'ACTIVE' })
  status: UserStatus;
}

export class UpdateMerchantRequest {
  @ApiProperty({ example: 'Jalan pasti ketemu lagi update' })
  address: string;
  @ApiProperty({ example: '13:00' })
  open_time: string;
  @ApiProperty({ example: '20:00' })
  close_time: string;
  @ApiProperty({ example: 'test12345' })
  password: string;
}

export class MerchantResponse {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  merchant_name: string;
  address: string;
  open_time: string;
  close_time: string;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
  token?: string;
}
