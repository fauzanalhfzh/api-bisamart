import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressRequest {
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
}

export class UpdateAddressRequest {
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
  id: number;
  user_id: number;

  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  is_primary: boolean;

  created_at: Date;
  updated_at: Date;
}
