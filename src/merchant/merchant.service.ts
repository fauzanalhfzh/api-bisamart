import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  LoginMerchantRequest,
  MerchantResponse,
  RegisterMerchantRequest,
  UpdateMerchantRequest,
  UpdateStatusRequest,
} from '../model/merchant.model';
import { MerchantValidation } from './merchant.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Merchant, Product } from '@prisma/client';
import { CreateProductRequest, ProductResponse } from 'src/model/product.model';

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

  async get(merhcant: Merchant): Promise<MerchantResponse> {
    this.logger.debug(`MerchantService.Get( ${JSON.stringify(merhcant)})`);
    return this.toMerchantResponse(merhcant);
  }

  async update(
    merchant: Merchant,
    request: UpdateMerchantRequest,
  ): Promise<MerchantResponse> {
    this.logger.debug(
      `MerchantService.Update(${JSON.stringify(merchant)}, ${JSON.stringify(request)})`,
    );

    const updateRequest: UpdateMerchantRequest =
      this.validationService.validate(MerchantValidation.UPDATE, request);

    if (updateRequest.address) {
      merchant.address = updateRequest.address;
    }

    if (updateRequest.open_time) {
      merchant.open_time = updateRequest.open_time;
    }

    if (updateRequest.close_time) {
      merchant.close_time = updateRequest.close_time;
    }

    if (updateRequest.password) {
      merchant.password = updateRequest.password;
    }

    const result = await this.prismaService.merchant.update({
      where: {
        email: merchant.email,
      },
      data: merchant,
    });

    return this.toMerchantResponse(result);
  }

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
        email: merchant.email,
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

  toProductResponse(product: Product): ProductResponse {
    if (!product) {
      throw new Error('Product is undefined or null');
    }

    return {
      id: product.id,
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      merchant_id: product.merchant_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  async addProduct(
    merchant: Merchant,
    request: CreateProductRequest,
  ): Promise<ProductResponse> {
    this.logger.debug(
      `MartService.create-product(${JSON.stringify(merchant)}, ${JSON.stringify(request)})`,
    );

    const createRequest: CreateProductRequest = this.validationService.validate(
      MerchantValidation.CREATEPRODUCT,
      request,
    );

    const product = await this.prismaService.product.create({
      data: createRequest,
    });

    return this.toProductResponse(product);
  }

  async getAllProduct(product: Product): Promise<ProductResponse[]> {
    this.logger.debug(`MartService.getAllProduct(${JSON.stringify(product)})`);

    const products = await this.prismaService.product.findMany();

    // convert to array
    const result = products.map((product) => this.toProductResponse(product));

    return result;
  }

  async getProductByMerchantId() {}
  async getProductById() {}
  async editProduct() {}
  async deleteProduct() {}
}
