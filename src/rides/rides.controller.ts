import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Patch,
  Post,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { WebResponse } from '../model/web.model';
import { RidesRequest, RidesResponse } from '../model/rides.model';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Driver } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
import { UpdateStatusRideRequest } from '../model/rides.model';
import { PrismaService } from '../common/prisma.service';

@ApiTags('Rides')
@Controller('api/v1/rides')
export class RidesController {
  constructor(
    private ridesService: RidesService,
    private prismaService: PrismaService,
  ) {}

  @Post('/new-rides')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create new rides' })
  async newRide(
    @Body() request: RidesRequest,
  ): Promise<WebResponse<RidesResponse>> {
    const result = await this.ridesService.newRide(request);
    return {
      data: result,
    };
  }

  @Patch('/update-status-rides')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update status rides' })
  async updateStatus(
    @Auth() driver: Driver,
    @Body() request: UpdateStatusRideRequest,
  ): Promise<WebResponse<RidesResponse>> {
    const ride = await this.prismaService.ride.findUnique({
      where: {
        id: request.id,
      },
    });

    if (!ride) {
      throw new HttpException(`Ride with ID ${request.id} not found`, 404);
    }

    const result = await this.ridesService.updateStatus(driver, ride, request);
    return {
      data: result,
    };
  }
}
