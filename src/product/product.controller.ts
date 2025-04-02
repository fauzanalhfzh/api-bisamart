import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
    const result = await this.productService.createProduct(user, request, file);
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
    @Param('id', ParseIntPipe) id: number,
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
  @ApiOperation({
    summary:
      'Get all product, use page and take for fastest render data. example : /product?page=1&take10',
  })
  async getAllProduct(
    @Query('page') page = '1',
    @Query('take') take = '10',
    @Query('search') search?: string,
  ): Promise<WebResponse<ProductResponse[]>> {
    const pageNumber = Number(page);
    const takeNumber = Number(take);

    const result = await this.productService.getAllProduct(
      pageNumber,
      takeNumber,
      search
    );
    return {
      data: result,
    };
  }

  @Get('/product/method-pickup')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Get product by pickup Method, use page and take for fastest render data. example : /product?page=1&take10',
  })
  async getProductByPickupMethod(
    @Query('page') page = '1',
    @Query('take') take = '10',
  ): Promise<WebResponse<ProductResponse[]>> {
    const pageNumber = Number(page);
    const takeNumber = Number(take);
    const result = await this.productService.getProductByPickupMethod(
      pageNumber,
      takeNumber,
    );
    return {
      data: result,
    };
  }

  @Get('/product/method-delivery')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Get product by Delivery Method, use page and take for fastest render data. example : /product?page=1&take10',
  })
  async getProductByDeliveryMethod(
    @Query('page') page = '1',
    @Query('take') take = '10',
  ): Promise<WebResponse<ProductResponse[]>> {
    const pageNumber = Number(page);
    const takeNumber = Number(take);
    const result = await this.productService.getProductByDeliveryMethod(
      pageNumber,
      takeNumber,
    );
    return {
      data: result,
    };
  }

  @Get('/product/method-both')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Get product by both Method, use page and take for fastest render data. example : /product?page=1&take10',
  })
  async getProductByBothMethod(
    @Query('page') page = '1',
    @Query('take') take = '10',
  ): Promise<WebResponse<ProductResponse[]>> {
    const pageNumber = Number(page);
    const takeNumber = Number(take);
    const result = await this.productService.getProductByBothMethod(
      pageNumber,
      takeNumber,
    );
    return {
      data: result,
    };
  }

  @Get('/product/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get product by id' })
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
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
    @Param('id', ParseIntPipe) id: number,
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
    @Param('id', ParseIntPipe) id: number,
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
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<boolean>> {
    await this.productService.deleteProductById(id);
    return {
      data: true,
    };
  }
}
