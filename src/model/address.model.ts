import { ApiProperty } from '@nestjs/swagger';
import { AddressTag } from '@prisma/client';

export class CreateAddressRequest {
  @ApiProperty({ example: '410fc4ac-ac58-4431-88a6-b18f055f6535' })
  user_id: string;
  @ApiProperty({ example: 'Jalan Situsari VI/3' })
  address_line: string;
  @ApiProperty({ example: 'Cilegon' })
  city: string;
  @ApiProperty({ example: 'Banten' })
  state: string;
  @ApiProperty({ example: '40265' })
  postal_code: string;
  @ApiProperty({ example: '-88.0284' })
  latitude: number;
  @ApiProperty({ example: '108.1750' })
  longitude: number;
  @ApiProperty({ example: true })
  is_primary: boolean;
  @ApiProperty({ example: AddressTag.RUMAH })
  tag: AddressTag;
}

export class UpdateAddressRequest {
  @ApiProperty({ example: '410fc4ac-ac58-4431-88a6-b18f055f6535' })
  user_id?: string;
  @ApiProperty({ example: 'Jalan Situsari VI/3' })
  address_line?: string;
  @ApiProperty({ example: 'Cilegon' })
  city?: string;
  @ApiProperty({ example: 'Banten' })
  state?: string;
  @ApiProperty({ example: '40265' })
  postal_code?: string;
  @ApiProperty({ example: '-88.0284' })
  latitude?: number;
  @ApiProperty({ example: '108.1750' })
  longitude?: number;
  @ApiProperty({ example: true })
  is_primary?: boolean;
}

export class AddressResponse {
  id: string;
  user_id: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  is_primary: boolean;
  tag: AddressTag;
  created_at: Date;
  updated_at: Date;
}
