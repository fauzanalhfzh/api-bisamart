import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginMerchantRequest,
  MerchantResponse,
  RegisterMerchantRequest,
  UpdateStatusRequest,
} from 'src/model/merchant.model';
import { WebResponse } from 'src/model/web.model';
import { Merchant } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Merchant')
@Controller('api/v1/merchant')
export class MerchantController {
  constructor(private merchantService: MerchantService) {}

  @Post('/auth/register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register new merchant' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ktp_url', maxCount: 1 },
        { name: 'self_photo_url', maxCount: 1 },
        { name: 'saving_book_url', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'ktp_url') {
              cb(null, './public/merchant/ktp');
            } else if (file.fieldname === 'self_photo_url') {
              cb(null, './public/merchant/selfie');
            } else if (file.fieldname === 'saving_book_url') {
              cb(null, './public/merchant/book');
            }
          },
          filename: (req, file, cb) => {
            const timestamp = Date.now();
            let prefix = '';

            switch (file.fieldname) {
              case 'ktp_url':
                prefix = 'KTP';
                break;
              case 'self_photo_url':
                prefix = 'SELFIE';
                break;
              case 'saving_book_url':
                prefix = 'SAVINGBOOKS';
                break;
            }

            const filename = `${prefix}${timestamp}${extname(file.originalname)}`
            cb(null, filename)
          },
        }),
      },
    ),
  )
  async register(
    @Body() request: RegisterMerchantRequest,
    @UploadedFiles()
    files: {
      ktp_url?: Express.Multer.File[];
      self_photo_url?: Express.Multer.File[];
      saving_book_url?: Express.Multer.File[];
    },
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.register(request, files);
    return {
      data: result,
    };
  }

  @Post('/auth/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'login merchant' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async get(
    @Auth() merchant: Merchant,
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.get(merchant);
    return {
      data: result,
    };
  }

  // @Patch('/current')
  // @HttpCode(200)
  // @ApiSecurity('Authorization')
  // @ApiOperation({ summary: 'Update data merchant' })
  // async update(
  //   @Auth() merchant: Merchant,
  //   @Body() request: UpdateMerchantRequest,
  // ): Promise<WebResponse<MerchantResponse>> {
  //   const result = await this.merchantService.update(merchant, request);
  //   return {
  //     data: result,
  //   };
  // }

  @Patch('/current/update-status')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update merchant status' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async logout(@Auth() merchant: Merchant): Promise<WebResponse<boolean>> {
    await this.merchantService.logout(merchant);
    return {
      data: true,
    };
  }
}
