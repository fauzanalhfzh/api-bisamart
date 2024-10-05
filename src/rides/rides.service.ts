import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  RidesRequest,
  RidesResponse,
  UpdateStatusRideRequest,
} from '../model/rides.model';
import { Logger } from 'winston';
import { RidesValidation } from './rides.validation';
import { Driver, Ride } from '@prisma/client';

@Injectable()
export class RidesService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async newRide(request: RidesRequest): Promise<RidesResponse> {
    this.logger.debug(`RidesService.NewRide(${JSON.stringify(request)})`);

    const ridesRequest: RidesRequest = this.validationService.validate(
      RidesValidation.NEWRIDE,
      request,
    );

    const baseDistance = 3; //minimal jarak
    const baseCharge = 7000;
    const additionalChargePerKm = 1850;
    const tax = 1500;

    let totalCharge: number;

    if (ridesRequest.distance > baseDistance) {
      const additionalDistance = ridesRequest.distance - baseDistance; // Hitung jarak tambahan
      const additionalCharge = additionalDistance * additionalChargePerKm; // Kalkulasi biaya tambahan
      const roundedNearest = this.roundToNearest500(additionalCharge);
      totalCharge = baseCharge + tax + roundedNearest; // Tambahkan biaya tambahan ke biaya total
    }

    const rides = await this.prismaService.ride.create({
      data: {
        ...ridesRequest,
        charge: totalCharge,
      },
    });

    return this.toRidesResponse(rides);
  }

  async updateStatus(
    driver: Driver,
    rides: Ride,
    request: UpdateStatusRideRequest,
  ): Promise<RidesResponse> {
    this.logger.debug(
      `RidesService.UpdateStatus(${JSON.stringify(driver)}, ${JSON.stringify(request)})`,
    );

    const updateStatusRequest: UpdateStatusRideRequest =
      this.validationService.validate(RidesValidation.UPDATE, request);

    if (updateStatusRequest.status) {
      rides.status = updateStatusRequest.status;
    }

    const result = await this.prismaService.ride.update({
      where: {
        id: rides.id,
      },
      data: rides,
    });

    return this.toRidesResponse(result);
  }

  roundToNearest500(value: number): number {
    return Math.round(value / 500) * 500;
  }

  toRidesResponse(rides: Ride): RidesResponse {
    return {
      id: rides.id,
      user_id: rides.user_id,
      driver_id: rides.driver_id,
      coupon_id: rides.coupon_id,
      charge: rides.charge,
      current_location_name: rides.current_location_name,
      destination_location_name: rides.destination_location_name,
      distance: rides.distance,
      status: rides.status,
      rating: rides.rating,
      created_at: rides.created_at,
      updated_at: rides.updated_at,
    };
  }
}
