import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Merchant, Product } from '@prisma/client';
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
      image_url: product.image_url,
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

  async createProduct(
    merchant: Merchant,
    request: CreateProductRequest,
    file?: Express.Multer.File,
  ): Promise<ProductResponse> {
    this.logger.debug(
      `MartService.create-product(${JSON.stringify(merchant)}, ${JSON.stringify(request)})`,
    );

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

    const createRequest: CreateProductRequest = this.validationService.validate(
      ProductValidation.CREATEPRODUCT,
      request,
    );

    const imageUrl = `/public/products/${file.filename}`;

    const product = await this.prismaService.product.create({
      data: {
        name: createRequest.name,
        description: createRequest.description,
        image_url: imageUrl,
        price: createRequest.price,
        stock: createRequest.stock,
        netto: createRequest.netto,
        discount: createRequest.discount,
        merchant_id: createRequest.merchant_id,
        category_id: createRequest.category_id,
      },
    });

    return this.toProductResponse(product);
  }

  async getAllProduct(): Promise<ProductResponse[]> {
    this.logger.debug(`MartService.getAllProduct()`);

    const products = await this.prismaService.product.findMany();

    // convert to array
    return products.map((product) => this.toProductResponse(product));
  }

  async getProductByMerchantId(id: string): Promise<ProductResponse[]> {
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

  async getProductById(id: string): Promise<ProductResponse> {
    this.logger.debug(`MartService.getProductById(${JSON.stringify(id)})`);

    const result = await this.checkProductMustExists(id);

    return this.toProductResponse(result);
  }

  async getProductByCategory(id: string): Promise<ProductResponse[]> {
    this.logger.debug(`MartService.getProductsByCategory(${JSON.stringify(id)})`);

    const products = await this.prismaService.product.findMany({
      where: {
        category_id: id
      },
      include: {
        category: true
      }
    })

    return products.map(product => ({
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
    }))
  }

  async editProduct(
    product: Product,
    request: UpdateProductRequest,
  ): Promise<ProductResponse> {
    this.logger.debug(
      `UserService.Update(${JSON.stringify(product)}, ${JSON.stringify(request)})`,
    );

    // Pastikan stock adalah number
    if (typeof request.stock !== 'number') {
      request.stock = parseInt(request.stock as unknown as string, 10);
      if (isNaN(request.stock)) {
        throw new Error('Stock harus berupa angka.');
      }
    }

    // Pastikan price adalah number
    if (typeof request.price !== 'number') {
      request.price = parseFloat(request.price as unknown as string);
      if (isNaN(request.price)) {
        throw new Error('Price harus berupa angka.');
      }
    }

    const updateRequest: UpdateProductRequest = this.validationService.validate(
      ProductValidation.UDPATE_PRODUCT,
      request,
    );

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

  async deleteProductById(id: string): Promise<ProductResponse> {
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
