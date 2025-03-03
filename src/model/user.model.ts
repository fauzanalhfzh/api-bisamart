import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';

export class RegisterUserRequest {
  @ApiProperty({ example: 'Bisa People 1' })
  name: string;
  @ApiProperty({ example: '62812345678' })
  phone_number: string;
  @ApiProperty({ example: 'bisa@example.com' })
  email: string;
  @ApiProperty({ example: 'test123' })
  password: string;
}

export class VerifiedUserRequest{
  @ApiProperty()
  otp: string;
}

export class LoginUserRequest {
  @ApiProperty({ example: '62812345678' })
  phone_number: string;
  @ApiProperty({ example: 'test123' })
  password: string;
}

export class UpdateUserRequest {
  @ApiProperty({ example: 'Bisa People Update', required: false })
  name?: string;
  @ApiProperty({ example: 'test123update', required: false })
  password?: string;
}

export class UserResponse {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  roles: string;
  is_verified: boolean;
  token?: string;
  created_at: Date;
  updated_at: Date;
}
