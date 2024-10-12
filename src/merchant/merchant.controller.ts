import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
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
import { Merchant, Product } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { CreateProductRequest, ProductResponse } from 'src/model/product.model';

@ApiTags('Merhcant')
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
  async addProduct(
    @Auth() merchant: Merchant,
    @Body() request: CreateProductRequest,
  ): Promise<WebResponse<ProductResponse>> {
    const result = await this.merchantService.addProduct(merchant, request);
    return {
      data: result,
    };
  }

  @Get('/product')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all product' })
  async getAllProduct(
    product: Product,
  ): Promise<WebResponse<ProductResponse[]>> {
    const result = await this.merchantService.getAllProduct(product);
    return {
      data: result,
    };
  }
}
