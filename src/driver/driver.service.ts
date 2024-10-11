import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  DriverResponse,
  LoginDriverRequest,
  RegisterDriverRequest,
  UpdateStatusRequest,
} from '../model/driver.model';
import { DriverValidation } from './driver.validation';
import * as bcrypt from 'bcrypt';
import { Driver, Ride } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { RidesResponse } from '../model/rides.model';

@Injectable()
export class DriverService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toDriverResponse(driver: Driver): DriverResponse {
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
      profile_img: driver.profile_img,
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

  async register(
    request: RegisterDriverRequest,
    files: {
      ktp_img?: Express.Multer.File[];
      sim_img?: Express.Multer.File[];
      selfie_with_sim?: Express.Multer.File[];
      profile_img?: Express.Multer.File[];
    },
  ): Promise<DriverResponse> {
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

    if (files.ktp_img?.[0]) {
      registerRequest.ktp_img = `/public/drivers/ktp/${files.ktp_img[0].filename}`;
    }
    if (files.sim_img?.[0]) {
      registerRequest.sim_img = `/public/drivers/sim/${files.sim_img[0].filename}`;
    }
    if (files.selfie_with_sim?.[0]) {
      registerRequest.selfie_with_sim = `/public/drivers/selfie/${files.selfie_with_sim[0].filename}`;
    }
    if (files.profile_img?.[0]) {
      registerRequest.profile_img = `/public/drivers/profile/${files.profile_img[0].filename}`;
    }

    const driver = await this.prismaService.driver.create({
      data: registerRequest,
    });

    return this.toDriverResponse(driver);
  }

  async login(request: LoginDriverRequest): Promise<DriverResponse> {
    this.logger.debug(`DriverService.login(${JSON.stringify(request)})`);

    const loginRequest: LoginDriverRequest = this.validationService.validate(
      DriverValidation.LOGIN,
      request,
    );

    let driver = await this.prismaService.driver.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!driver) {
      throw new HttpException('Email or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      driver.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Email or password is invalid', 401);
    }

    driver = await this.prismaService.driver.update({
      where: {
        email: loginRequest.email,
      },
      data: {
        token: uuid(),
      },
    });

    return this.toDriverResponse(driver);
  }

  async get(driver: Driver): Promise<DriverResponse> {
    this.logger.debug(`DriverService.Get ( ${JSON.stringify(driver)})`);
    return this.toDriverResponse(driver);
  }

  async checkDriverMustExists(ktp: string, id: string): Promise<Driver> {
    const driver = await this.prismaService.driver.findFirst({
      where: {
        ktp: ktp,
        id: id,
      },
    });

    if (!driver) {
      throw new HttpException('driver is not found', 404);
    }

    return driver;
  }

  async getById(driver: Driver, id: string): Promise<DriverResponse> {
    this.logger.debug(`DriverService.GetbyId(${JSON.stringify(driver)})`);

    const result = await this.checkDriverMustExists(driver.ktp, id);
    return this.toDriverResponse(result);
  }

  async updateStatus(
    driver: Driver,
    request: UpdateStatusRequest,
  ): Promise<DriverResponse> {
    this.logger.debug(
      `DriverService.UpdateStatus(${JSON.stringify(driver)}, ${JSON.stringify(request)})`,
    );
    const updateStatusRequest: UpdateStatusRequest =
      this.validationService.validate(DriverValidation.UPDATESTATUS, request);

    if (updateStatusRequest.status) {
      driver.status = updateStatusRequest.status;
    }

    const result = await this.prismaService.driver.update({
      where: {
        ktp: driver.ktp,
      },
      data: driver,
    });

    return this.toDriverResponse(result);
  }

  async getAllRides(driver: Driver): Promise<RidesResponse[]> {
    this.logger.debug(`DriverService.getAllRides( ${JSON.stringify(driver)})`);

    const data = await this.prismaService.ride.findMany({
      where: {
        driver_id: driver.id,
      },
      include: {
        driver: true,
        user: true,
      },
    });

    const mappedData = data.map((ride) => ({
      id: ride.id,
      user_id: ride.user_id,
      driver_id: ride.driver_id,
      charge: ride.charge,
      current_location_name: ride.current_location_name,
      destination_location_name: ride.destination_location_name,
      distance: ride.distance,
      status: ride.status,
      rating: ride.rating,
      created_at: ride.created_at,
      updated_at: ride.updated_at,
    }));

    return mappedData;
  }

  async logout(driver: Driver): Promise<DriverResponse> {
    const result = await this.prismaService.driver.update({
      where: {
        email: driver.email,
      },
      data: {
        token: null,
      },
    });

    return this.toDriverResponse(result);
  }
}
