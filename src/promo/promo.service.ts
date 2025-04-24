import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Prisma, Promo, Roles, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CreatePromoRequest, PromoResponse } from 'src/model/promo.model';
import { Logger } from 'winston';
import { PromoValidation } from './promo.validation';

@Injectable()
export class PromoService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toPromoResponse(promo: Promo): PromoResponse {
    if (!promo) {
      throw new Error('Promo is undefined or null');
    }

    return {
      id: promo.id,
      thumbnail: promo.thumbnail,
      code: promo.code,
      name: promo.name,
      discount_amount: promo.discount_amount,
      expiration_date: promo.expiration_date,
      usage_limit: promo.usage_limit,
      created_at: promo.created_at,
      updated_at: promo.updated_at,
    };
  }

  async checkPromoMustExists(id: number): Promise<Promo> {
    const promo = await this.prismaService.promo.findFirst({
      where: {
        id: id,
      },
    });

    if (!promo) {
      throw new HttpException('Promo is not found', 404);
    }

    return promo;
  }

  async createPromo(
    user: User,
    request: CreatePromoRequest,
    file: { image?: Express.Multer.File[] },
  ): Promise<PromoResponse> {
    this.logger.debug(
      `MartService.create-promo(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    if (user.roles !== Roles.GODMODE) {
      throw new HttpException(
        'Forbidden: Only SUPER DUPER GOD ADMIN can create promo.',
        401,
      );
    }

    if (typeof request.discount_amount !== 'number') {
      request.discount_amount = parseFloat(
        request.discount_amount as unknown as string,
      );
      if (isNaN(request.discount_amount)) {
        throw new HttpException('Discount amount must be a number.', 400);
      }
    }

    if (typeof request.usage_limit !== 'number') {
      request.usage_limit = parseFloat(
        request.usage_limit as unknown as string,
      );
      if (isNaN(request.usage_limit)) {
        throw new HttpException('Usage limit must be a number.', 400);
      }
    }

    const createRequest: CreatePromoRequest = this.validationService.validate(
      PromoValidation.CREATEPROMO,
      request,
    );

    if (file.image?.[0]) {
      createRequest.thumbnail = `/public/promo/${file.image[0].filename}`;
    } else {
      this.logger.warn('File thumbnails tidak ditemukan atau kosong.');
      throw new Error('Image file is required.');
    }

    const promo = await this.prismaService.promo.create({
      data: createRequest,
    });

    return this.toPromoResponse(promo);
  }

  async getALlPromo(
    page: number,
    take: number,
    search?: string,
  ): Promise<PromoResponse[]> {
    this.logger.debug(`MartService.getAllPomo()`);

    const skip = (page - 1) * take;

    const whereCondition: Prisma.PromoWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const promos = await this.prismaService.promo.findMany({
      where: whereCondition,
      skip: skip,
      take: take,
      orderBy: { created_at: 'desc' },
    });

    return promos.map((promos) => this.toPromoResponse(promos));
  }

  async deletePromoById(id: number): Promise<PromoResponse> {
    this.logger.debug(`MartService.deletePromoById(${JSON.stringify(id)})`);

    const promo = await this.checkPromoMustExists(id);

    const result = await this.prismaService.promo.delete({
      where: {
        id: promo.id,
      },
    });

    return this.toPromoResponse(result);
  }
}
