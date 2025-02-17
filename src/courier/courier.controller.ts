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
import { CourierService } from './courier.service';
import { WebResponse } from '../model/web.model';
import {
  CourierResponse,
  LoginCourierRequest,
  RegisterCourierRequest,
  UpdateStatusRequest,
} from '../model/courier.model';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from '../common/auth.decorator';
import { Courier } from '@prisma/client';

@ApiTags('Courier')
@Controller('/api/v1/courier')
export class CourierController {
  constructor(private courierService: CourierService) {}

  @Post('/auth/register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register new driver' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ktp_url', maxCount: 1 },
        { name: 'selfie_with_sim_url', maxCount: 1 },
        { name: 'profile_url', maxCount: 1 },
        { name: 'license_url', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'ktp_url') {
              cb(null, './storage/courier/ktp');
            } else if (file.fieldname === 'selfie_with_sim_url') {
              cb(null, './storage/courier/sim');
            } else if (file.fieldname === 'profile_url') {
              cb(null, './storage/courier/profile');
            } else if (file.fieldname === 'license_url') {
              cb(null, './storage/courier/license');
            }
          },
          filename: (req, file, cb) => {
            const timestamp = Date.now();
            let prefix = '';

            switch (file.fieldname) {
              case 'ktp_url':
                prefix = 'KTP';
                break;
              case 'selfie_with_sim_url':
                prefix = 'SIM';
                break;
              case 'profile_url':
                prefix = 'PRFL';
                break;
              case 'license_url':
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Courier registration',
    type: RegisterCourierRequest,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        phone_number: { type: 'string' },
        password: { type: 'string' },
        address_ktp: { type: 'string' },
        ktp: { type: 'string' },
        ktp_url: { type: 'string', format: 'binary' },
        selfie_with_sim_url: { type: 'string', format: 'binary' },
        profile_url: { type: 'string', format: 'binary' },
        vehicle_brand: { type: 'string' },
        vehicle_color: { type: 'string' },
        vehicle_speed: { type: 'integer' },
        registration_number: { type: 'string' },
        license_plate: { type: 'string' },
        license_url: { type: 'string', format: 'binary' },
      },
    },
  })
  async register(
    @Body() request: RegisterCourierRequest,
    @UploadedFiles()
    files: {
      ktp_url?: Express.Multer.File[];
      selfie_with_sim_url?: Express.Multer.File[];
      profile_url?: Express.Multer.File[];
      license_url?: Express.Multer.File[];
    },
  ): Promise<WebResponse<CourierResponse>> {
    const result = await this.courierService.register(request, files);
    return {
      data: result,
    };
  }

  @Post('/auth/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login Courier' })
  async login(
    @Body() request: LoginCourierRequest,
  ): Promise<WebResponse<CourierResponse>> {
    const result = await this.courierService.login(request);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get Courier Data' })
  async get(@Auth() courier: Courier): Promise<WebResponse<CourierResponse>> {
    const result = await this.courierService.get(courier);
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
    @Auth() courier: Courier,
    @Body() request: UpdateStatusRequest,
  ): Promise<WebResponse<CourierResponse>> {
    const result = await this.courierService.updateStatus(courier, request);
    return {
      data: result,
    };
  }

  @Delete('/auth/logout')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Logout Courier' })
  async logout(@Auth() courier: Courier): Promise<WebResponse<boolean>> {
    await this.courierService.logout(courier);
    return {
      data: true,
    };
  }
}
