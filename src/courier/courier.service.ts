import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  CourierResponse,
  LoginCourierRequest,
  RegisterCourierRequest,
  UpdateStatusRequest,
} from '../model/courier.model';
import { CourierValidation } from './courier.validation';
import * as bcrypt from 'bcrypt';
import { Courier } from '@prisma/client';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CourierService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toDriverResponse(courier: Courier): CourierResponse {
    const courierResponse: CourierResponse = {
      id: courier.id,
      name: courier.name,
      email: courier.email,
      phone_number: courier.phone_number,
      address_ktp: courier.address_ktp,
      ktp: courier.ktp,
      ktp_url: courier.ktp_url,
      selfie_with_sim_url: courier.selfie_with_sim_url,
      profile_url: courier.profile_url,
      vehicle_brand: courier.vehicle_brand,
      vehicle_color: courier.vehicle_color,
      vehicle_speed: courier.vehicle_speed,
      registration_number: courier.registration_number,
      license_plate: courier.license_plate,
      license_url: courier.license_url,
      status: courier.status,
      ratings: courier.ratings,
      total_earning: courier.total_earning,
      total_rides: courier.total_rides,
      pending_rides: courier.pending_rides,
      cancel_rides: courier.cancel_rides,
      created_at: courier.created_at,
      updated_at: courier.updated_at,
    };

    if (courier.token) {
      courierResponse.token = courier.token;
    }

    return courierResponse;
  }

  async register(
    request: RegisterCourierRequest,
    files: {
      ktp_url?: Express.Multer.File[];
      selfie_with_sim_url?: Express.Multer.File[];
      license_url?: Express.Multer.File[];
      profile_url?: Express.Multer.File[];
    },
  ): Promise<CourierResponse> {
    this.logger.debug(`DriverService.register(${JSON.stringify(request)})`);

    if (typeof request.vehicle_speed !== 'number') {
      request.vehicle_speed = parseFloat(request.vehicle_speed as unknown as string);
      if (isNaN(request.vehicle_speed)) {
        throw new Error('Speed harus berupa number.');
      }
    }

    const registerRequest: RegisterCourierRequest =
      this.validationService.validate(CourierValidation.REGISTER, request);

    const totalDriverWithSameKTP = await this.prismaService.courier.count({
      where: {
        ktp: registerRequest.ktp,
      },
    });

    if (totalDriverWithSameKTP != 0) {
      throw new HttpException('Phone number already exist', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    if (files.ktp_url?.[0]) {
      registerRequest.ktp_url = `/public/courier/ktp/${files.ktp_url[0].filename}`;
    }
    if (files.selfie_with_sim_url?.[0]) {
      registerRequest.selfie_with_sim_url = `/public/courier/selfie/${files.selfie_with_sim_url[0].filename}`;
    }
    if (files.profile_url?.[0]) {
      registerRequest.profile_url = `/public/courier/profile/${files.profile_url[0].filename}`;
    }

    if (files.license_url?.[0]) {
      registerRequest.license_url = `/public/courier/license/${files.license_url[0].filename}`;
    }

    const courier = await this.prismaService.courier.create({
      data: registerRequest,
    });

    return this.toDriverResponse(courier);
  }

  async login(request: LoginCourierRequest): Promise<CourierResponse> {
    this.logger.debug(`DriverService.login(${JSON.stringify(request)})`);

    const loginRequest: LoginCourierRequest = this.validationService.validate(
      CourierValidation.LOGIN,
      request,
    );

    let courier = await this.prismaService.courier.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!courier) {
      throw new HttpException('Email or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      courier.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Email or password is invalid', 401);
    }

    courier = await this.prismaService.courier.update({
      where: {
        email: loginRequest.email,
      },
      data: {
        token: uuid(),
      },
    });

    return this.toDriverResponse(courier);
  }

  async get(courier: Courier): Promise<CourierResponse> {
    this.logger.debug(`DriverService.Get ( ${JSON.stringify(courier)})`);
    return this.toDriverResponse(courier);
  }

  async checkCourierMustExists(ktp: string, id: string): Promise<Courier> {
    const courier = await this.prismaService.courier.findFirst({
      where: {
        ktp: ktp,
        id: id,
      },
    });

    if (!courier) {
      throw new HttpException('driver is not found', 404);
    }

    return courier;
  }

  async getById(courier: Courier, id: string): Promise<CourierResponse> {
    this.logger.debug(`DriverService.GetbyId(${JSON.stringify(courier)})`);

    const result = await this.checkCourierMustExists(courier.ktp, id);
    return this.toDriverResponse(result);
  }

  async updateStatus(
    courier: Courier,
    request: UpdateStatusRequest,
  ): Promise<CourierResponse> {
    this.logger.debug(
      `DriverService.UpdateStatus(${JSON.stringify(courier)}, ${JSON.stringify(request)})`,
    );
    const updateStatusRequest: UpdateStatusRequest =
      this.validationService.validate(CourierValidation.UPDATESTATUS, request);

    if (updateStatusRequest.status) {
      courier.status = updateStatusRequest.status;
    }

    const result = await this.prismaService.courier.update({
      where: {
        email: courier.email,
      },
      data: courier,
    });

    return this.toDriverResponse(result);
  }

  async logout(courier: Courier): Promise<CourierResponse> {
    const result = await this.prismaService.courier.update({
      where: {
        email: courier.email,
      },
      data: {
        token: null,
      },
    });

    return this.toDriverResponse(result);
  }
}
