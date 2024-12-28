import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { AddressResponse, CreateAddressRequest } from 'src/model/address.model';
import { WebResponse } from 'src/model/web.model';

@ApiTags('Address User')
@Controller('/api/v1/users/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('/create')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create address for users' })
  async create(
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    const result = await this.addressService.create(request);
    return {
      data: result,
    };
  }
}
