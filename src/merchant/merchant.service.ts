import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  MerchantResponse,
  RegisterMerchantRequest,
  UpdateStatusRequest,
} from '../model/merchant.model';
import { MerchantValidation } from './merchant.validation';
import { Merchant, Product, User } from '@prisma/client';

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
      user_id: merchant.user_id,
      merchant_category_id: merchant.merchant_category_id,
      ktp: merchant.ktp,
      ktp_photo: merchant.ktp_photo,
      place_of_birth: merchant.place_of_birth,
      date_of_birth: merchant.date_of_birth,
      address_ktp: merchant.address_ktp,
      self_photo: merchant.self_photo,
      bank_name: merchant.bank_name,
      account_number: merchant.account_number,
      owner_name: merchant.owner_name,
      saving_book_photo: merchant.saving_book_photo,
      status: merchant.status,
      merchant_name: merchant.merchant_name,
      ratings: merchant.ratings,
      total_earning: merchant.total_earning,
      total_order: merchant.total_order,
      pending_order: merchant.pending_order,
      cancel_order: merchant.cancel_order,
      created_at: merchant.created_at,
      updated_at: merchant.updated_at,
    };

    return merchantResponse;
  }

  // toProductResponse(product: Product): ProductResponse {
  //   if (!product) {
  //     throw new Error('Product is undefined or null');
  //   }

  //   return {
  //     id: product.id,
  //     image_url: product.image_url,
  //     name: product.name,
  //     description: product.description,
  //     price: product.price,
  //     stock: product.stock,
  //     netto: product.netto,
  //     discount: product.discount,
  //     merchant_id: product.merchant_id,
  //     category_id: product.category_id,
  //     created_at: product.created_at,
  //     updated_at: product.updated_at,
  //   };
  // }

  async checkMerchantMustExists(id: number): Promise<Merchant> {
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

  async checkProductMustExists(id: number): Promise<Product> {
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
    user: User,
    request: RegisterMerchantRequest,
    files: {
      ktp_photo?: Express.Multer.File[];
      self_photo?: Express.Multer.File[];
      saving_book_photo?: Express.Multer.File[];
    },
  ): Promise<MerchantResponse> {
    this.logger.debug(`MartService.register(${JSON.stringify(request)})`);

    if (!user.is_verified) {
      throw new HttpException(
        'Email harus diverifikasi sebelum mendaftar sebagai Merchant',
        400,
      );
    }

    if (
      request.merchant_category_id !== undefined &&
      request.merchant_category_id !== null
    ) {
      if (typeof request.merchant_category_id !== 'number') {
        request.merchant_category_id = parseFloat(
          request.merchant_category_id as unknown as string,
        );
        if (isNaN(request.merchant_category_id)) {
          throw new Error('Speed harus berupa number.');
        }
      }
    }

    const registerRequest: RegisterMerchantRequest =
      this.validationService.validate(MerchantValidation.REGISTER, request);

    const categoryExists = await this.prismaService.merchantCategory.findUnique(
      {
        where: { id: registerRequest.merchant_category_id },
      },
    );

    if (!categoryExists) {
      throw new BadRequestException('Merchant category not found');
    }

    const totalMartWithSameKTP = await this.prismaService.merchant.count({
      where: {
        ktp: registerRequest.ktp,
      },
    });

    const existingCourier = await this.prismaService.courier.findUnique({
      where: { user_id: user.id },
    });

    if (existingCourier) {
      throw new HttpException('User sudah terdaftar sebagai Courier', 400);
    }

    if (totalMartWithSameKTP != 0) {
      throw new HttpException('KTP already exist', 400);
    }

    if (files.ktp_photo?.[0]) {
      registerRequest.ktp_photo = `/storage/merchant/ktp/${files.ktp_photo[0].filename}`;
    }

    if (files.saving_book_photo?.[0]) {
      registerRequest.saving_book_photo = `/storage/merchant/book/${files.saving_book_photo[0].filename}`;
    }

    if (files.self_photo?.[0]) {
      registerRequest.self_photo = `/storage/merchant/selfie/${files.self_photo[0].filename}`;
    }

    await this.prismaService.user.update({
      where: { id: user.id},
      data: { roles: "MERCHANT"}
    })

    const merchant = await this.prismaService.merchant.create({
      data: {
        user_id: user.id,
        merchant_category_id: registerRequest.merchant_category_id,
        ktp: registerRequest.ktp,
        ktp_photo: registerRequest.ktp_photo,
        place_of_birth: registerRequest.place_of_birth,
        date_of_birth: new Date(registerRequest.date_of_birth),
        address_ktp: registerRequest.address_ktp,
        self_photo: registerRequest.self_photo,
        bank_name: registerRequest.bank_name,
        account_number: registerRequest.account_number,
        owner_name: registerRequest.owner_name,
        saving_book_photo: registerRequest.saving_book_photo,
        merchant_name: registerRequest.merchant_name,
      },
    });

    return this.toMerchantResponse(merchant);
  }

  async get(user: User): Promise<MerchantResponse> {
    this.logger.debug(`MerchantService.Get( ${JSON.stringify(user)})`);
    const merchant = await this.prismaService.merchant.findUnique({
      where: { user_id: user.id },
      include: {
        User: true,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant tidak ditemukan.');
    }

    return this.toMerchantResponse(merchant);
  }

  //! create service for adding operating hours
  
  async updateStatus(
    user: User,
    request: UpdateStatusRequest,
  ): Promise<MerchantResponse> {
    this.logger.debug(
      `MerchantService.UpdateStatus(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    const updateStatusRequest: UpdateStatusRequest =
      this.validationService.validate(MerchantValidation.UPDATESTATUS, request);

    const result = await this.prismaService.merchant.update({
      where: { user_id: user.id },
      data: {
        status: updateStatusRequest.status,
      },
    });

    return this.toMerchantResponse(result);
  }
}
