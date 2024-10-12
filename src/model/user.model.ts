import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty({ example: '0812345' })
  phone_number: string;
  @ApiProperty({ example: 'test@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
  @ApiProperty({ example: 'Zen Ganteng' })
  name: string;
}

export class LoginUserRequest {
  @ApiProperty({ example: 'test@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
}

export class UpdateUserRequest {
  @ApiProperty({ example: 'Zen tambah ganteng' })
  name?: string;
  @ApiProperty({ example: 'updatepassword' })
  password?: string;
}

export class UserResponse {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  ratings: number;
  total_ride: number;
  total_order: number;
  created_at: Date;
  updated_at: Date;
  token?: string;
}
