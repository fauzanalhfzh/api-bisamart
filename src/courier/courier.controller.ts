import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CourierService } from './courier.service';
import { WebResponse } from '../model/web.model';
import {
  CourierResponse,
  RegisterCourierRequest,
  UpdateStatusRequest,
} from '../model/courier.model';
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from '../common/auth.decorator';
import { Courier, User } from '@prisma/client';

@ApiTags('Courier')
@Controller('/api/v1/courier')
export class CourierController {
  constructor(private courierService: CourierService) {}

  @Post('/auth/register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register new driver' })
  // @ApiSecurity('Authorization')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ktp_photo', maxCount: 1 },
        { name: 'selfie_with_sim_photo', maxCount: 1 },
        { name: 'profile_photo', maxCount: 1 },
        { name: 'license_photo', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'ktp_photo') {
              cb(null, './storage/courier/ktp');
            } else if (file.fieldname === 'selfie_with_sim_photo') {
              cb(null, './storage/courier/sim');
            } else if (file.fieldname === 'profile_photo') {
              cb(null, './storage/courier/profile');
            } else if (file.fieldname === 'license_photo') {
              cb(null, './storage/courier/license');
            }
          },
          filename: (req, file, cb) => {
            const timestamp = Date.now();
            let prefix = '';

            switch (file.fieldname) {
              case 'ktp_photo':
                prefix = 'KTP';
                break;
              case 'selfie_with_sim_photo':
                prefix = 'SIM';
                break;
              case 'profile_photo':
                prefix = 'PP';
                break;
              case 'license_photo':
                prefix = 'LNC';
                break;
            }

            const filename = `${prefix}${timestamp}${extname(file.originalname)}`;
            cb(null, filename);
          },
        }),
      },
    ),
  )
  async register(
    @Auth() user: User,
    @Body() request: RegisterCourierRequest,
    @UploadedFiles()
    files: {
      ktp_photo?: Express.Multer.File[];
      selfie_with_sim_photo?: Express.Multer.File[];
      profile_photo?: Express.Multer.File[];
      license_photo?: Express.Multer.File[];
    },
  ): Promise<WebResponse<CourierResponse>> {
    const result = await this.courierService.register(user, request, files);
    return {
      data: result,
    };
  }


  @Get('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get Courier Data' })
  async get(@Auth() user: User): Promise<WebResponse<CourierResponse>> {
    const result = await this.courierService.get(user);
    return {
      data: result,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get Courier By ID' })
  async getById(
    @Auth() courier: Courier,
    @Param('id') id: string,
  ): Promise<WebResponse<CourierResponse>> {
    const result = await this.courierService.getById(courier, id);
    return {
      data: result,
    };
  }

  @Patch('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update Courier Status' })
  async updateStatus(
    
    @Auth() user: User,
    @Body() request: UpdateStatusRequest,
  ): Promise<WebResponse<CourierResponse>> {
    const result = await this.courierService.updateStatus(user, request);
    return {
      data: result,
    };
  }

}
