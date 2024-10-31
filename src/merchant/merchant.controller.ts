import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  LoginMerchantRequest,
  MerchantResponse,
  RegisterMerchantRequest,
  UpdateMerchantRequest,
  UpdateStatusRequest,
} from 'src/model/merchant.model';
import { WebResponse } from 'src/model/web.model';
import { Merchant } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { CreateProductRequest, ProductResponse } from 'src/model/product.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@ApiTags('Merchant')
@Controller('api/v1/merchant')
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Post('/auth/register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register new merchant' })
  async register(
    @Body() request: RegisterMerchantRequest,
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.register(request);
    return {
      data: result,
    };
  }

  @Post('/auth/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'login merchant' })
  async login(
    @Body() request: LoginMerchantRequest,
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.login(request);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get Merchant data' })
  async get(
    @Auth() merchant: Merchant,
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.get(merchant);
    return {
      data: result,
    };
  }

  @Patch('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update data merchant' })
  async update(
    @Auth() merchant: Merchant,
    @Body() request: UpdateMerchantRequest,
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.update(merchant, request);
    return {
      data: result,
    };
  }

  @Patch('/current/update-status')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update merchant status' })
  async updateStatus(
    @Auth() merchant: Merchant,
    @Body() request: UpdateStatusRequest,
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.updateStatus(merchant, request);
    return {
      data: result,
    };
  }

  @Delete('/auth/logout')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Logout merchant' })
  async logout(@Auth() merchant: Merchant): Promise<WebResponse<boolean>> {
    await this.merchantService.logout(merchant);
    return {
      data: true,
    };
  }

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
    const result = await this.merchantService.createProduct(
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
    const result = await this.merchantService.getAllProduct();
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
    const result = await this.merchantService.getProductById(id);
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
    const result = await this.merchantService.getProductByMerchantId(id);
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
    await this.merchantService.deleteProductById(id);
    return {
      data: true,
    };
  }
}
