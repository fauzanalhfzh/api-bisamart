import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  CourierResponse,
  RegisterCourierRequest,
  UpdateStatusRequest,
} from '../model/courier.model';
import { CourierValidation } from './courier.validation';
import { Courier, User } from '@prisma/client';

@Injectable()
export class CourierService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toCourierResponse(courier: Courier): CourierResponse {
    const courierResponse: CourierResponse = {
      id: courier.id,
      user_id: courier.user_id,
      date_of_birth: courier.date_of_birth,
      address_ktp: courier.address_ktp,
      ktp: courier.ktp,
      ktp_photo: courier.ktp_photo,
      selfie_with_sim_photo: courier.selfie_with_sim_photo,
      profile_photo: courier.profile_photo,
      vehicle_brand: courier.vehicle_brand,
      vehicle_color: courier.vehicle_color,
      vehicle_speed: courier.vehicle_speed,
      registration_number: courier.registration_number,
      license_plate: courier.license_plate,
      license_photo: courier.license_photo,
      status: courier.status,
      ratings: courier.ratings,
      total_earning: courier.total_earning,
      total_rides: courier.total_rides,
      pending_rides: courier.pending_rides,
      cancel_rides: courier.cancel_rides,
      created_at: courier.created_at,
      updated_at: courier.updated_at,
    };

    return courierResponse;
  }

  async register(
    user: User,
    request: RegisterCourierRequest,
    files: {
      ktp_photo?: Express.Multer.File[];
      selfie_with_sim_photo?: Express.Multer.File[];
      license_photo?: Express.Multer.File[];
      profile_photo?: Express.Multer.File[];
    },
  ): Promise<CourierResponse> {
    this.logger.debug(`DriverService.register(${JSON.stringify(request)})`);

    if (request.vehicle_speed !== undefined && request.vehicle_speed !== null) {
      if (typeof request.vehicle_speed !== 'number') {
        request.vehicle_speed = parseFloat(
          request.vehicle_speed as unknown as string,
        );
        if (isNaN(request.vehicle_speed)) {
          throw new Error('Speed harus berupa number.');
        }
      }
    }

    const registerRequest: RegisterCourierRequest =
      this.validationService.validate(CourierValidation.REGISTER, request);

    if (files.ktp_photo?.[0]) {
      registerRequest.ktp_photo = `/storage/courier/ktp/${files.ktp_photo[0].filename}`;
    }
    if (files.selfie_with_sim_photo?.[0]) {
      registerRequest.selfie_with_sim_photo = `/storage/courier/selfie/${files.selfie_with_sim_photo[0].filename}`;
    }
    if (files.profile_photo?.[0]) {
      registerRequest.profile_photo = `/storage/courier/profile/${files.profile_photo[0].filename}`;
    }

    if (files.license_photo?.[0]) {
      registerRequest.license_photo = `/storage/courier/license/${files.license_photo[0].filename}`;
    }

    const courier = await this.prismaService.courier.create({
      data: {
        user_id: user.id,
        date_of_birth: new Date(registerRequest.date_of_birth),
        address_ktp: registerRequest.address_ktp,
        ktp: registerRequest.ktp,
        ktp_photo: registerRequest.ktp_photo,
        selfie_with_sim_photo: registerRequest.selfie_with_sim_photo,
        profile_photo: registerRequest.profile_photo,
        vehicle_brand: registerRequest.vehicle_brand,
        vehicle_color: registerRequest.vehicle_color,
        vehicle_speed: registerRequest.vehicle_speed,
        registration_number: registerRequest.registration_number,
        license_plate: registerRequest.license_plate,
        license_photo: registerRequest.license_photo,
      },
    });

    return this.toCourierResponse(courier);
  }

  async get(user: User): Promise<CourierResponse> {
    this.logger.debug(`DriverService.Get (${JSON.stringify(user)})`);
  
    const courier = await this.prismaService.courier.findUnique({
      where: { user_id: user.id },
      include: {
        User: true, 
      },
    });
  
    if (!courier) {
      throw new NotFoundException('Courier tidak ditemukan.');
    }
  
    return this.toCourierResponse(courier);
  }

  async checkCourierMustExists(ktp: string, id: string): Promise<Courier> {
    const courier = await this.prismaService.courier.findFirst({
      where: {
        ktp: ktp,
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
    return this.toCourierResponse(result);
  }

  async updateStatus(
    user: User,
    request: UpdateStatusRequest,
  ): Promise<CourierResponse> {
    this.logger.debug(
      `DriverService.UpdateStatus(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    const updateStatusRequest: UpdateStatusRequest =
      this.validationService.validate(CourierValidation.UPDATESTATUS, request);

    const result = await this.prismaService.courier.update({
      where: { user_id: user.id },
      data: {
        status: updateStatusRequest.status,
      },
    });

    return this.toCourierResponse(result);
  }
}
