import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty({ example: '0812345' })
  phone_number: string;
  @ApiProperty({ example: 'zen@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
  @ApiProperty({ example: 'Zen Ganteng' })
  name: string;
}

export class LoginUserRequest {
  @ApiProperty({ example: 'zen@example.com' })
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
  id: number;
  name: string;
  phone_number: string;
  email: string;
  ratings: number;
  total_rides: number;
  token?: string;
  created_at: Date;
  updated_at: Date;
}
