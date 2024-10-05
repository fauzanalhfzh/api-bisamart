import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';
import { RidesResponse } from '../model/rides.model';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.register(${JSON.stringify(request)})`);

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSamePhoneNumber = await this.prismaService.user.count({
      where: {
        phone_number: registerRequest.phone_number,
      },
    });

    if (totalUserWithSamePhoneNumber != 0) {
      throw new HttpException('Phone number already exist', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      id: user.id,
      name: user.name,
      phone_number: user.phone_number,
      email: user.email,
      ratings: user.ratings,
      total_ride: user.total_ride,
      total_order: user.total_order,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.Login(${JSON.stringify(request)})`);

    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new HttpException('Email or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Email or password is invalid', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        email: loginRequest.email,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      id: user.id,
      email: user.email,
      phone_number: user.phone_number,
      name: user.name,
      token: user.token,
      ratings: user.ratings,
      total_ride: user.total_ride,
      total_order: user.total_order,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async get(user: User): Promise<UserResponse> {
    this.logger.debug(`UserService.Get ( ${JSON.stringify(user)})`);
    return {
      id: user.id,
      email: user.email,
      phone_number: user.phone_number,
      name: user.name,
      ratings: user.ratings,
      total_ride: user.total_ride,
      total_order: user.total_order,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.Update(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: user,
    });

    return {
      id: user.id,
      name: result.name,
      email: result.email,
      phone_number: result.phone_number,
      ratings: user.ratings,
      total_ride: user.total_ride,
      total_order: user.total_order,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async getAllRides(user: User): Promise<RidesResponse[]> {
    this.logger.debug(`DriverService.getAllRides( ${JSON.stringify(user)})`);

    const data = await this.prismaService.ride.findMany({
      where: {
        user_id: user.id,
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

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: {
        token: null,
      },
    });

    return {
      id: user.id,
      email: user.email,
      phone_number: user.phone_number,
      name: user.phone_number,
      ratings: user.ratings,
      total_ride: user.total_ride,
      total_order: user.total_order,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
