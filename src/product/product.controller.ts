import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from '../common/auth.decorator';
import { DeliveryMethod, Merchant, User } from '@prisma/client';
import {
  CreateProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from '../model/product.model';
import { WebResponse } from '../model/web.model';

@ApiTags('Product')
@Controller('api/v1/merchant')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/product')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Create new product' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'image',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'image') {
              cb(null, './public/products');
            }
          },
          filename(req, file, cb) {
            const timestamp = Date.now();
            let prefix = 'PR';
            const filename = `${prefix}-${timestamp}${extname(file.originalname)}`;
            cb(null, filename);
          },
        }),
      },
    ),
  )
  async createProduct(
    @Auth() user: User,
    @Body() request: CreateProductRequest,
    @UploadedFiles() file: { image: Express.Multer.File[] },
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productService.createProduct(
      user,
      request,
      file,
    );
    return {
      data: result,
    };
  }

  @Patch('/product/:id')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'image',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'image') {
              cb(null, './public/products');
            }
          },
          filename(req, file, cb) {
            const timestamp = Date.now();
            let prefix = 'PR';
            const filename = `${prefix}-${timestamp}${extname(file.originalname)}`;
            cb(null, filename);
          },
        }),
      },
    ),
  )
  async updateProduct(
    @Auth() merchant: Merchant,
    @Body() request: UpdateProductRequest,
    @Param('id') id: number,
    @UploadedFiles() files: { image: Express.Multer.File[] },
  ): Promise<WebResponse<ProductResponse>> {
    const product = await this.productService.checkProductMustExists(id);
    const result = await this.productService.editProduct(
      merchant,
      product,
      request,
      id,
      files,
    );
    return {
      data: result,
    };
  }

  @Get('/product')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all product' })
  async getAllProduct(): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productService.getAllProduct();
    return {
      data: result,
    };
  }

  @Get('/product/method-pickup')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product by pickup Method' })
  async getProductByPickupMethod(): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productService.getProductByPickupMethod();
    return {
      data: result,
    };
  }

  @Get('/product/method-delivery')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product by Delivery Method' })
  async getProductByDeliveryMethod(): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productService.getProductByDeliveryMethod();
    return {
      data: result,
    };
  }

  @Get('/product/method-both')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product by both Method' })
  async getProductByBothMethod(): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productService.getProductByBothMethod();
    return {
      data: result,
    };
  }

  @Get('/product/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product by id' })
  async getProductById(
    @Param('id') id: number,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productService.getProductById(id);
    return {
      data: result,
    };
  }
  
  @Get('merchant/:id/product')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all product by merchant ID' })
  async getProductByMerchantId(
    @Param('id') id: number,
  ): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productService.getProductByMerchantId(id);
    return {
      data: result,
    };
  }

  @Get('categories/:id/products')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all product by category' })
  async getProductByCategory(
    @Param('id') id: number,
  ): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productService.getProductByCategory(id);
    return {
      data: result,
    };
  }

  @Delete('/product/:id')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Delete product by id' })
  async deleteProductById(
    @Param('id') id: number,
  ): Promise<WebResponse<boolean>> {
    await this.productService.deleteProductById(id);
    return {
      data: true,
    };
  }
}
