import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DeliveryMethod, Merchant, Prisma, Product, Roles, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from '../model/product.model';
import { Logger } from 'winston';
import { ProductValidation } from '../product/product.validation';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toProductResponse(product: Product): ProductResponse {
    if (!product) {
      throw new Error('Product is undefined or null');
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      stock: product.stock,
      netto: product.netto,
      discount: product.discount,
      delivery_method: product.delivery_method,
      merchant_id: product.merchant_id,
      category_id: product.category_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

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

  async createProduct(
    user: User,
    request: CreateProductRequest,
    files: {
      image?: Express.Multer.File[];
    },
  ): Promise<ProductResponse> {
    this.logger.debug(
      `MartService.create-product(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    if (user.roles !== Roles.MERCHANT) {
      throw new HttpException(
        'Forbidden: Only merchants can create products.',
        401,
      );
    }

    if (typeof request.merchant_id !== 'number') {
      request.merchant_id = parseFloat(
        request.merchant_id as unknown as string,
      );
      if (isNaN(request.merchant_id)) {
        throw new HttpException('Merchant ID harus berupa number.', 400);
      }
    }

    if (typeof request.category_id !== 'number') {
      request.category_id = parseFloat(
        request.category_id as unknown as string,
      );
      if (isNaN(request.category_id)) {
        throw new HttpException('Category ID harus berupa number.', 400);
      }
    }

    // Pastikan price adalah number
    if (typeof request.price !== 'number') {
      request.price = parseFloat(request.price as unknown as string);
      if (isNaN(request.price)) {
        throw new HttpException('Price harus berupa number.', 400);
      }
    }

    // Pastikan stock adalah number
    if (typeof request.stock !== 'number') {
      request.stock = parseInt(request.stock as unknown as string, 10);
      if (isNaN(request.stock)) {
        throw new HttpException('Stock harus berupa number.', 400);
      }
    }

    // Pastikan netto adalah number
    if (typeof request.netto !== 'number') {
      request.netto = parseFloat(request.netto as unknown as string);
      if (isNaN(request.netto)) {
        throw new HttpException('Netto harus berupa number.', 400);
      }
    }

    // Pastikan discount adalah number
    if (typeof request.discount !== 'number') {
      request.discount = parseFloat(request.discount as unknown as string);
      if (isNaN(request.discount)) {
        throw new HttpException('Discount harus berupa number.', 400);
      }
    }

    const createRequest: CreateProductRequest = this.validationService.validate(
      ProductValidation.CREATEPRODUCT,
      request,
    );

    if (files.image?.[0]) {
      createRequest.image = `/public/products/${files.image[0].filename}`;
    } else {
      this.logger.warn('File image tidak ditemukan atau kosong.');
      throw new Error('Image file is required.');
    }

    const product = await this.prismaService.product.create({
      data: createRequest,
    });

    return this.toProductResponse(product);
  }

  async getAllProduct(
    page: number,
    take: number,
    search?: string,
  ): Promise<ProductResponse[]> {
    this.logger.debug(`MartService.getAllProduct()`);

    const skip = (page - 1) * take; // Hitung offset berdasarkan halaman

    const whereCondition: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const products = await this.prismaService.product.findMany({
      where: whereCondition,
      skip: skip,
      take: take,
      orderBy: { created_at: 'desc' },
    });

    return products.map((product) => this.toProductResponse(product));
  }

  async getProductByMerchantId(id: number): Promise<ProductResponse[]> {
    this.logger.debug(
      `MartService.getProductByMerchantId(${JSON.stringify(id)})`,
    );

    const merchant = await this.checkMerchantMustExists(id);

    const products = await this.prismaService.product.findMany({
      where: {
        merchant_id: merchant.id,
      },
    });

    if (!products || products.length === 0) {
      throw new HttpException('No products found for this merchant', 404);
    }

    return products.map((product) => this.toProductResponse(product));
  }

  async getProductById(id: number): Promise<ProductResponse> {
    this.logger.debug(`MartService.getProductById(${JSON.stringify(id)})`);

    const result = await this.checkProductMustExists(id);

    return this.toProductResponse(result);
  }

  async getProductByPickupMethod(
    page: number,
    take: number,
  ): Promise<ProductResponse[]> {
    this.logger.debug(`Fetching products with pickup method`);

    const skip = (page - 1) * take;

    const products = await this.prismaService.product.findMany({
      where: {
        delivery_method: DeliveryMethod.PICKUP,
      },
      skip: skip,
      take: take,
      orderBy: { created_at: 'desc' },
    });

    return products.map((product) => this.toProductResponse(product));
  }

  async getProductByDeliveryMethod(
    page: number,
    take: number,
  ): Promise<ProductResponse[]> {
    this.logger.debug(`Fetching products with pickup method`);

    const skip = (page - 1) * take;

    const products = await this.prismaService.product.findMany({
      where: {
        delivery_method: DeliveryMethod.DELIVERY,
      },
      skip: skip,
      take: take,
      orderBy: { created_at: 'desc' },
    });

    return products.map((product) => this.toProductResponse(product));
  }

  async getProductByBothMethod(
    page: number,
    take: number,
  ): Promise<ProductResponse[]> {
    this.logger.debug(`Fetching products with pickup method`);

    const skip = (page - 1) * take;

    const products = await this.prismaService.product.findMany({
      where: {
        delivery_method: DeliveryMethod.BOTH,
      },
      skip: skip,
      take: take,
      orderBy: { created_at: 'desc' },
    });

    return products.map((product) => this.toProductResponse(product));
  }

  async getProductByCategory(id: number): Promise<ProductResponse[]> {
    this.logger.debug(
      `MartService.getProductsByCategory(${JSON.stringify(id)})`,
    );

    const products = await this.prismaService.product.findMany({
      where: {
        category_id: id,
      },
      include: {
        Category: true,
      },
    });

    return products.map((product) => this.toProductResponse(product));
  }

  async editProduct(
    merchant: Merchant,
    product: Product,
    request: UpdateProductRequest,
    id: number,
    files: {
      image?: Express.Multer.File[];
    },
  ): Promise<ProductResponse> {
    this.logger.debug(`UserService.Update(${JSON.stringify(request)})`);
    this.logger.debug(`UserService.Update(${JSON.stringify(product)})`);
    this.logger.debug(`UserService.Update(${JSON.stringify(merchant)})`);

    await this.checkProductMustExists(id);

    // Pastikan price adalah number
    if (typeof request.price !== 'number') {
      request.price = parseFloat(request.price as unknown as string);
      if (isNaN(request.price)) {
        throw new Error('Price harus berupa angka.');
      }
    }

    // Pastikan stock adalah number
    if (typeof request.stock !== 'number') {
      request.stock = parseInt(request.stock as unknown as string, 10);
      if (isNaN(request.stock)) {
        throw new Error('Stock harus berupa angka.');
      }
    }

    // Pastikan netto adalah number
    if (typeof request.netto !== 'number') {
      request.netto = parseFloat(request.netto as unknown as string);
      if (isNaN(request.netto)) {
        throw new Error('Netto harus berupa angka.');
      }
    }

    // Pastikan discount adalah number
    if (typeof request.discount !== 'number') {
      request.discount = parseFloat(request.discount as unknown as string);
      if (isNaN(request.discount)) {
        throw new Error('Discount harus berupa angka.');
      }
    }

    const updateRequest: UpdateProductRequest = this.validationService.validate(
      ProductValidation.UDPATE_PRODUCT,
      request,
    );

    if (files.image?.[0]) {
      // Hapus gambar sebelumnya
      const oldImagePath = path.join(process.cwd(), product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updateRequest.image = `/public/products/${files.image[0].filename}`;
    } else {
      this.logger.warn('File image_url tidak ditemukan atau kosong.');
      throw new Error('Image file is required.');
    }

    if (updateRequest.name) {
      product.name = updateRequest.name;
    }

    if (updateRequest.description) {
      product.description = updateRequest.description;
    }

    if (updateRequest.price) {
      product.price = updateRequest.price;
    }

    if (updateRequest.stock) {
      product.stock = updateRequest.stock;
    }

    const result = await this.prismaService.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });

    return this.toProductResponse(result);
  }

  async deleteProductById(id: number): Promise<ProductResponse> {
    this.logger.debug(`MartService.deleteProductById(${JSON.stringify(id)})`);

    const product = await this.checkProductMustExists(id);

    const result = await this.prismaService.product.delete({
      where: {
        id: product.id,
      },
    });

    return this.toProductResponse(result);
  }
}
