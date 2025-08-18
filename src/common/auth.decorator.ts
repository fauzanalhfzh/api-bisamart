import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Mengembalikan user jika ada, atau null jika tidak ada
    if (user) {
      return user;
    }
    return null;  // Atau bisa undefined jika ingin lebih eksplisit
  },
);
 