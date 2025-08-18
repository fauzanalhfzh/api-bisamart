import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = req.headers['authorization'] as string;

    if (token) {
      try {
        const user = await this.prismaService.user.findFirst({
          where: {
            token: token,
          },
        });

        if (user) {
          req.user = user;
        }
      } catch (err) {
        // Log error kalau perlu, tapi jangan hentikan flow
        console.error('Token check error:', err);
      }
    }

    next();
  }
}
