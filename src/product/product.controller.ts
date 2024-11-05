import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Auth } from '../common/auth.decorator';
import { Merchant } from '@prisma/client';
import { CreateProductRequest, ProductResponse } from '../model/product.model';
import { WebResponse } from '../model/web.model';

@ApiTags('Product')
@Controller('api/v1/merchant')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/product')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Create new product' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public/products'),
        filename: (req, file, cb) => {
          const filename = `PR${Date.now()}` + extname(file.originalname);
          cb(null, filename);
        },
      }),
    }),
  )
  async createProduct(
    @Auth() merchant: Merchant,
    @Body() request: CreateProductRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productService.createProduct(
      merchant,
      request,
      file,
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

  @Get('/product/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product by id' })
  async getProductById(
    @Param('id') id: string,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.productService.getProductById(id);
    return {
      data: result,
    };
  }

  @Get('/:id/product')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all product by merchant ID' })
  async getProductByMerchantId(
    @Param('id') id: string,
  ): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.productService.getProductByMerchantId(id);
    return {
      data: result,
    };
  }

  @Delete('/product/:id')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Delete product by id' })
  async deleteProductById(
    @Param('id') id: string,
  ): Promise<WebResponse<boolean>> {
    await this.productService.deleteProductById(id);
    return {
      data: true,
    };
  }
}
