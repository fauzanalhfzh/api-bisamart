import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.delete({
      where: {
        email: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        email: 'test',
        phone_number: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
      },
    });
  }
}
