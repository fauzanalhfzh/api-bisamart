import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { driver, user } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test',
      },
    });
  }

  async getUser(): Promise<user> {
    return await this.prismaService.user.findUnique({
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
        token: 'test',
      },
    });
  }

  async getDriver(): Promise<driver> {
    return await this.prismaService.driver.findUnique({
      where: {
        ktp: 'test',
      },
    });
  }

  async createDriver() {
    await this.prismaService.driver.create({
      data: {
        name: 'test',
        phone_number: 'test',
        email: 'test',
        password: await bcrypt.hash('test', 10),
        country: 'test',
        ktp: 'test',
        address_ktp: 'test',
        ktp_img: 'test',
        vehicle_type: 'MOTOR',
        sim: 'test',
        sim_img: 'test',
        selfie_with_sim: 'test',
        vehicle_brand: 'test',
        vehicle_color: 'test',
        license_plate: 'test',
        registration_number: 'test',
        profile_img: 'test',
      },
    });
  }

  async deleteDriver() {
    await this.prismaService.driver.deleteMany({
      where: {
        ktp: 'test',
      },
    });
  }
}
