import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { AddressResponse, CreateAddressRequest } from 'src/model/address.model';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Address User')
@Controller('/api/v1/users/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('/create')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Create address for users' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Auth() user: User,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    const result = await this.addressService.create(user, request);
    return {
      data: result,
    };
  }
}
