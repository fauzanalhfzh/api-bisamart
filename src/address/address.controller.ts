import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
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
  async create(
    @Auth() user: User,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    const result = await this.addressService.create(user, request);
    return {
      data: result,
    };
  }

  @Delete('/delete/:id')
  @HttpCode(200)
  @ApiSecurity('Authorization')
  @ApiOperation({ summary: 'Delete address from users' })
  async delete(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<boolean>> {
    await this.addressService.delete(user, id);
    return {
      data: true,
    };
  }
}
