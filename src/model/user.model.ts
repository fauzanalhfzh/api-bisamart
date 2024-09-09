export class RegisterUserRequest {
  phone_number: string;
  email: string;
  password: string;
  name: string;
}

export class UserResponse {
  phone_number: string;
  email: string;
  name: string;
  token?: string;
}
