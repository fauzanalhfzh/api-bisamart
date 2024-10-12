import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers['authorization'] as string;
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      const driver = await this.prismaService.driver.findFirst({
        where: {
          token: token,
        },
      });

      const merchant = await this.prismaService.merchant.findFirst({
        where: {
          token: token,
        },
      });

      if (user) {
        req.user = user;
      } else if (driver) {
        req.driver = driver;
      } else if (merchant) {
        req.merchant = merchant;
      }
    }

    next();
  }
}
