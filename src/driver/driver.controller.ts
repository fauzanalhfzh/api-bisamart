import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { WebResponse } from '../model/web.model';
import {
  DriverResponse,
  LoginDriverRequest,
  RegisterDriverRequest,
  UpdateStatusRequest,
} from '../model/driver.model';
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
import { driver, rides } from '@prisma/client';
import { RidesResponse } from '../model/rides.model';

@ApiTags('Drivers')
@Controller('/api/drivers')
export class DriverController {
  constructor(private driverService: DriverService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Register new driver' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ktp_img', maxCount: 1 },
        { name: 'sim_img', maxCount: 1 },
        { name: 'selfie_with_sim', maxCount: 1 },
        { name: 'profile_img', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'ktp_img') {
              cb(null, './public/drivers/ktp');
            } else if (file.fieldname === 'sim_img') {
              cb(null, './public/drivers/sim');
            } else if (file.fieldname === 'selfie_with_sim') {
              cb(null, './public/drivers/selfie');
            } else if (file.fieldname === 'profile_img') {
              cb(null, './public/drivers/profile');
            }
          },
          filename: (req, file, cb) => {
            const randomName = Date.now() + extname(file.originalname);
            cb(null, randomName);
          },
        }),
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Driver registration',
    type: RegisterDriverRequest,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone_number: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        country: { type: 'string' },
        ktp: { type: 'string' },
        address_ktp: { type: 'string' },
        ktp_img: { type: 'string', format: 'binary' },
        vehicle_type: { type: 'string' },
        sim: { type: 'string' },
        sim_img: { type: 'string', format: 'binary' },
        selfie_with_sim: { type: 'string', format: 'binary' },
        vehicle_brand: { type: 'string' },
        vehicle_color: { type: 'string' },
        license_plate: { type: 'string' },
        registration_number: { type: 'string' },
        profil_img: { type: 'string', format: 'binary' },
      },
    },
  })
  async register(
    @Body() request: RegisterDriverRequest,
    @UploadedFiles()
    files: {
      ktp_img?: Express.Multer.File[];
      sim_img?: Express.Multer.File[];
      selfie_with_sim?: Express.Multer.File[];
      profile_img?: Express.Multer.File[];
    },
  ): Promise<WebResponse<DriverResponse>> {
    const result = await this.driverService.register(request, files);
    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login driver' })
  async login(
    @Body() request: LoginDriverRequest,
  ): Promise<WebResponse<DriverResponse>> {
    const result = await this.driverService.login(request);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get driver data' })
  async get(@Auth() driver: driver): Promise<WebResponse<DriverResponse>> {
    const result = await this.driverService.get(driver);
    return {
      data: result,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get driver by id' })
  async getById(
    @Auth() driver: driver,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<DriverResponse>> {
    const result = await this.driverService.getById(driver, id);
    return {
      data: result,
    };
  }

  @Patch('/current')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Update driver status' })
  async updateStatus(
    @Auth() driver: driver,
    @Body() request: UpdateStatusRequest,
  ): Promise<WebResponse<DriverResponse>> {
    const result = await this.driverService.updateStatus(driver, request);
    return {
      data: result,
    };
  }

  @Get('/get-rides')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Get all rides history' })
  async getAllRides(
    @Auth() driver: any,
  ): Promise<WebResponse<RidesResponse[]>> {
    const result = await this.driverService.getAllRides(driver);
    return {
      data: result,
    };
  }
}
