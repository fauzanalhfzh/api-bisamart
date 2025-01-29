import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  LoginMerchantRequest,
  MerchantResponse,
  RegisterMerchantRequest,
  UpdateStatusRequest,
} from '../model/merchant.model';
import { MerchantValidation } from './merchant.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Merchant, Product } from '@prisma/client';
import { ProductResponse } from 'src/model/product.model';

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
      email: merchant.email,
      phone_number: merchant.phone_number,
      ktp: merchant.ktp,
      ktp_url: merchant.ktp_url,
      place_of_birth: merchant.place_of_birth,
      date_of_birth: merchant.date_of_birth,
      address_ktp: merchant.address_ktp,
      self_photo_url: merchant.self_photo_url,
      bank_name: merchant.bank_name,
      account_number: merchant.account_number,
      owner_name: merchant.owner_name,
      saving_book_url: merchant.saving_book_url,
      status: merchant.status,
      merchant_name: merchant.merchant_name,
      category_merchant: merchant.category_merchant,
      address_line: merchant.address_line,
      city: merchant.city,
      state: merchant.state,
      postal_code: merchant.postal_code,
      latitude: merchant.latitude,
      longitude: merchant.longitude,
      ratings: merchant.ratings,
      total_earning: merchant.total_earning,
      total_order: merchant.total_order,
      pending_order: merchant.pending_order,
      cancel_order: merchant.cancel_order,
      created_at: merchant.created_at,
      updated_at: merchant.updated_at,
    };

    if (merchant.token) {
      merchantResponse.token = merchant.token;
    }

    return merchantResponse;
  }

  toProductResponse(product: Product): ProductResponse {
    if (!product) {
      throw new Error('Product is undefined or null');
    }

    return {
      id: product.id,
      image_url: product.image_url,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      netto: product.netto,
      discount: product.discount,
      merchant_id: product.merchant_id,
      category_id: product.category_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  async checkMerchantMustExists(id: string): Promise<Merchant> {
    const merchant = await this.prismaService.merchant.findFirst({
      where: {
        id: id,
      },
    });

    if (!merchant) {
      throw new HttpException('Merchant is not found', 404);
    }

    return merchant;
  }

  async checkProductMustExists(id: string): Promise<Product> {
    const product = await this.prismaService.product.findFirst({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new HttpException('Product is not found', 404);
    }

    return product;
  }

  async register(
    request: RegisterMerchantRequest,
    files: {
      ktp_url?: Express.Multer.File[];
      self_photo_url?: Express.Multer.File[];
      saving_book_url?: Express.Multer.File[];
    },
  ): Promise<MerchantResponse> {
    this.logger.debug(`MartService.register(${JSON.stringify(request)})`);

    if (typeof request.latitude !== 'number') {
      request.latitude = parseFloat(request.latitude as unknown as string);
      if (isNaN(request.latitude)) {
        throw new Error('Latitude harus berupa number.');
      }
    }

    if (typeof request.longitude !== 'number') {
      request.longitude = parseFloat(request.longitude as unknown as string);
      if (isNaN(request.longitude)) {
        throw new Error('Latitude harus berupa number.');
      }
    }
    
    const registerRequest: RegisterMerchantRequest =
      this.validationService.validate(MerchantValidation.REGISTER, request);

    const totalMartWithSameKTP =
      await this.prismaService.merchant.count({
        where: {
          ktp: registerRequest.ktp,
        },
      });

      const totalMartWithSamePhoneNumber =
      await this.prismaService.merchant.count({
        where: {
          phone_number: registerRequest.phone_number,
        },
      });

      const totalMartWithSameEmail =
      await this.prismaService.merchant.count({
        where: {
          email: registerRequest.email,
        },
      });

    if (totalMartWithSameKTP != 0) {
      throw new HttpException('KTP already exist', 400);
    }

    if (totalMartWithSamePhoneNumber != 0) {
      throw new HttpException('Phone Number already exist', 400);
    }

    if (totalMartWithSameEmail != 0) {
      throw new HttpException('Email already exist', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    if(files.ktp_url?.[0]) {
      registerRequest.ktp_url = `/public/merchant/ktp/${files.ktp_url[0].filename}`
    }

    if(files.saving_book_url?.[0]) {
      registerRequest.saving_book_url = `/public/merchant/book/${files.saving_book_url[0].filename}`
    }

    if(files.self_photo_url?.[0]) {
      registerRequest.self_photo_url = `/public/merchant/selfie/${files.self_photo_url[0].filename}`
    }

    const merchant = await this.prismaService.merchant.create({
      data: registerRequest,
    });

    return this.toMerchantResponse(merchant);
  }

  async login(request: LoginMerchantRequest): Promise<MerchantResponse> {
    this.logger.debug(`MartService.login(${JSON.stringify(request)})`);

    const loginRequest: LoginMerchantRequest = this.validationService.validate(
      MerchantValidation.LOGIN,
      request,
    );

    let merchant = await this.prismaService.merchant.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!merchant) {
      throw new HttpException('Email or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      merchant.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Email or password is invalid', 401);
    }

    merchant = await this.prismaService.merchant.update({
      where: {
        email: loginRequest.email,
      },
      data: {
        token: uuid(),
      },
    });

    return this.toMerchantResponse(merchant);
  }

  async get(merchant: Merchant): Promise<MerchantResponse> {
    this.logger.debug(`MerchantService.Get( ${JSON.stringify(merchant)})`);
    return this.toMerchantResponse(merchant);
  }

  // async update(
  //   merchant: Merchant,
  //   request: UpdateMerchantRequest,
  // ): Promise<MerchantResponse> {
  //   this.logger.debug(
  //     `MerchantService.Update(${JSON.stringify(merchant)}, ${JSON.stringify(request)})`,
  //   );

  //   const updateRequest: UpdateMerchantRequest =
  //     this.validationService.validate(
  //       MerchantValidation.UPDATE_MERCHANT,
  //       request,
  //     );

  //   if (updateRequest.address) {
  //     merchant.address = updateRequest.address;
  //   }

  //   if (updateRequest.open_time) {
  //     merchant.open_time = updateRequest.open_time;
  //   }

  //   if (updateRequest.close_time) {
  //     merchant.close_time = updateRequest.close_time;
  //   }

  //   if (updateRequest.password) {
  //     merchant.password = updateRequest.password;
  //   }

  //   const result = await this.prismaService.merchant.update({
  //     where: {
  //       email: merchant.email,
  //     },
  //     data: merchant,
  //   });

  //   return this.toMerchantResponse(result);
  // }

  async updateStatus(
    merchant: Merchant,
    request: UpdateStatusRequest,
  ): Promise<MerchantResponse> {
    this.logger.debug(
      `MerchantService.UpdateStatus(${JSON.stringify(merchant)}, ${JSON.stringify(request)})`,
    );

    const updateStatusRequest: UpdateStatusRequest =
      this.validationService.validate(MerchantValidation.UPDATESTATUS, request);

    if (updateStatusRequest.status) {
      merchant.status = updateStatusRequest.status;
    }

    const result = await this.prismaService.merchant.update({
      where: {
        ktp: merchant.ktp,
      },
      data: merchant,
    });

    return this.toMerchantResponse(result);
  }

  async logout(merchant: Merchant): Promise<MerchantResponse> {
    const result = await this.prismaService.merchant.update({
      where: {
        email: merchant.email,
      },
      data: {
        token: null,
      },
    });

    return this.toMerchantResponse(result);
  }
}
