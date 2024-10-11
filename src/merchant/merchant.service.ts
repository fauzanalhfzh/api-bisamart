import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  MerchantResponse,
  RegisterMerchantRequest,
} from '../model/merchant.model';
import { MerchantValidation } from './merchant.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Merchant } from '@prisma/client';

@Injectable()
export class MerchantService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toMerchantResponse(merchant: Merchant): MerchantResponse {
    const merchantResponse: MerchantResponse = {
      id: merchant.id,
      name: merchant.name,
      phone_number: merchant.phone_number,
      email: merchant.email,
      merchant_name: merchant.merchant_name,
      address: merchant.address,
      open_time: merchant.open_time,
      close_time: merchant.close_time,
      status: merchant.status,
      created_at: merchant.created_at,
      updated_at: merchant.updated_at,
    };

    if (merchant.token) {
      merchantResponse.token = merchant.token;
    }

    return merchantResponse;
  }

  async register(request: RegisterMerchantRequest): Promise<MerchantResponse> {
    this.logger.debug(`MartService.register(${JSON.stringify(request)})`);

    const registerRequest: RegisterMerchantRequest =
      this.validationService.validate(MerchantValidation.REGISTER, request);

    const totalMartWithSamePhoneNumber =
      await this.prismaService.merchant.count({
        where: {
          phone_number: registerRequest.phone_number,
        },
      });

    if (totalMartWithSamePhoneNumber != 0) {
      throw new HttpException('Phone number already exist', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const merchant = await this.prismaService.merchant.create({
      data: registerRequest,
    });

    return this.toMerchantResponse(merchant);
  }

  async login() {}

  async get() {}

  async update() {}

  async logout() {}
}
