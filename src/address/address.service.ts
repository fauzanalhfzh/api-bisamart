import { BadRequestException, HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      created_at: address.created_at,
      updated_at: address.updated_at,
    };
  }

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(`AddressService.create(${JSON.stringify(request)})`);

    if (typeof request.latitude !== 'number') {
      request.latitude = parseFloat(request.latitude as unknown as string);
      if (isNaN(request.latitude)) {
        throw new BadRequestException('Latitude harus berupa number.');
      }
    }

    if (typeof request.longitude !== 'number') {
      request.longitude = parseFloat(request.longitude as unknown as string);
      if (isNaN(request.longitude)) {
        throw new BadRequestException('Price harus berupa number.');
      }
    }

    // Cek apakah user sudah memiliki primary address
    const existingPrimary = await this.prismaService.address.findFirst({
      where: { user_id: user.id, is_primary: true },
    });

    if (existingPrimary && request.is_primary) {
      throw new HttpException(
        'User sudah memiliki alamat utama. Hanya satu alamat yang bisa menjadi primary.', 400,
      );
    }

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
      },
    });

    return this.toAddressResponse(address);
  }

  async delete(user: User, id: number): Promise<AddressResponse> {
    this.logger.debug(`AddressService.delete(${user.id}, ${id})`);
  
    // Cek apakah alamat ada dan milik user
    const address = await this.prismaService.address.findUnique({
      where: { id },
    });
  
    if (!address) {
      throw new NotFoundException('Alamat tidak ditemukan.');
    }
  
    if (address.user_id !== user.id) {
      throw new UnauthorizedException('Anda tidak memiliki izin untuk menghapus alamat ini.');
    }
  
    // Jika alamat yang dihapus adalah primary
    if (address.is_primary) {
      // Cari alamat lain milik user untuk dijadikan primary
      const otherAddress = await this.prismaService.address.findFirst({
        where: { user_id: user.id, id: { not: id } },
      });
  
      if (otherAddress) {
        await this.prismaService.address.update({
          where: { id: otherAddress.id },
          data: { is_primary: true },
        });
      }
    }
  
    // Hapus alamat
    const deletedAddress = await this.prismaService.address.delete({
      where: { id },
    });
  
    this.logger.debug(`Address ${id} berhasil dihapus.`);
  
    return this.toAddressResponse(deletedAddress);
  }
}
