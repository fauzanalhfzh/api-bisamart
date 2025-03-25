import {
  Body,
  Controller,
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
  MerchantOperatingHoursRequest,
  MerchantOperatingHoursResponse,
  MerchantResponse,
  RegisterMerchantRequest,
  UpdateStatusRequest,
} from 'src/model/merchant.model';
import { WebResponse } from 'src/model/web.model';
import { Merchant, User } from '@prisma/client';
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
  @ApiSecurity('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ktp_photo', maxCount: 1 },
        { name: 'self_photo', maxCount: 1 },
        { name: 'saving_book_photo', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'ktp_photo') {
              cb(null, './storage/merchant/ktp');
            } else if (file.fieldname === 'self_photo') {
              cb(null, './storage/merchant/selfie');
            } else if (file.fieldname === 'saving_book_photo') {
              cb(null, './storage/merchant/book');
            }
          },
          filename: (req, file, cb) => {
            const timestamp = Date.now();
            let prefix = '';

            switch (file.fieldname) {
              case 'ktp_photo':
                prefix = 'KTP';
                break;
              case 'self_photo':
                prefix = 'SELFIE';
                break;
              case 'saving_book_photo':
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
    @Auth() user: User,
    @Body() request: RegisterMerchantRequest,
    @UploadedFiles()
    files: {
      ktp_photo?: Express.Multer.File[];
      self_photo?: Express.Multer.File[];
      saving_book_photo?: Express.Multer.File[];
    },
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.register(user, request, files);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get Merchant data' })
  async get(
    @Auth() user: User,
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.get(user);
    return {
      data: result,
    };
  }

  @Patch('/current/update-status')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update merchant status' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateStatus(
    @Auth() user: User,
    @Body() request: UpdateStatusRequest,
  ): Promise<WebResponse<MerchantResponse>> {
    const result = await this.merchantService.updateStatus(user, request);
    return {
      data: result,
    };
  }

  @Patch('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Create Merchant Operating Hours' })
  async update(
    @Auth() user: User,
    @Body() request: MerchantOperatingHoursRequest,
  ): Promise<WebResponse<MerchantOperatingHoursResponse>> {
    const result = await this.merchantService.createOperatingHours(user, request);
    return {
      data: result,
    };
  }
}
