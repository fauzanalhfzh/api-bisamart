import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DriverResponse, RegisterDriverRequest } from '../model/driver.model';
import { DriverValidation } from './driver.validation';
import * as bcrypt from 'bcrypt';
import { driver } from '@prisma/client';

@Injectable()
export class DriverService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toDriverResponse(driver: driver): DriverResponse {
    const driverResponse: DriverResponse = {
      id: driver.id,
      name: driver.name,
      phone_number: driver.phone_number,
      email: driver.email,
      country: driver.country,
      ktp: driver.ktp,
      address_ktp: driver.address_ktp,
      ktp_img: driver.ktp_img,
      vehicle_type: driver.vehicle_type,
      sim: driver.sim,
      sim_img: driver.sim_img,
      selfie_with_sim: driver.selfie_with_sim,
      vehicle_brand: driver.vehicle_brand,
      vehicle_color: driver.vehicle_color,
      license_plate: driver.license_plate,
      registration_number: driver.registration_number,
      profil_img: driver.profil_img,
      ratings: driver.ratings,
      total_earning: driver.total_earning,
      total_rides: driver.total_rides,
      pending_rides: driver.pending_rides,
      cancel_rides: driver.cancel_rides,
      status: driver.status,
      created_at: driver.created_at,
      updated_at: driver.updated_at,
    };

    if (driver.token) {
      driverResponse.token = driver.token;
    }

    return driverResponse;
  }

  async register(request: RegisterDriverRequest): Promise<DriverResponse> {
    this.logger.debug(`DriverService.register(${JSON.stringify(request)})`);

    const registerRequest: RegisterDriverRequest =
      this.validationService.validate(DriverValidation.REGISTER, request);

    const totalDriverWithSameKTP = await this.prismaService.driver.count({
      where: {
        ktp: registerRequest.ktp,
      },
    });

    if (totalDriverWithSameKTP != 0) {
      throw new HttpException('Phone number already exist', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const driver = await this.prismaService.driver.create({
      data: registerRequest,
    });

    return this.toDriverResponse(driver);
  }
}
