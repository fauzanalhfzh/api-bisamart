import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const driver = request.driver;
    if (user) {
      return user;
    } else if (driver) {
      return driver;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  },
);
