import { Inject, Injectable } from '@nestjs/common';
import { Address, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { AddressResponse, CreateAddressRequest } from 'src/model/address.model';
import { Logger } from 'winston';
import { addressValidation } from './address.validation';

@Injectable()
export class AddressService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toAddressResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      user_id: address.user_id,
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      latitude: address.latitude,
      longitude: address.longitude,
      is_primary: address.is_primary,
      tag: address.tag,
      created_at: address.created_at,
      updated_at: address.updated_at,
    };
  }

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(`AddressService.create(${JSON.stringify(request)})`);

    const createRequest: CreateAddressRequest = this.validationService.validate(
      addressValidation.CREATE,
      request,
    );

    const address = await this.prismaService.address.create({
      data: {
        user_id: user.id,
        address_line: createRequest.address_line,
        city: createRequest.city,
        state: createRequest.state,
        postal_code: createRequest.postal_code,
        latitude: createRequest.latitude,
        longitude: createRequest.longitude,
        is_primary: createRequest.is_primary,
        tag: createRequest.tag,
      },
    });

    return this.toAddressResponse(address);
  }
}
