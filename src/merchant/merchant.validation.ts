import { MerchantStatus } from '@prisma/client';
import { z, ZodType } from 'zod';

export class MerchantValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(50),
    email: z.string().min(1).max(50),
    phone_number: z.string().min(1).max(50),
    password: z.string().min(1).max(50),
    ktp: z.string().min(20),
    place_of_birth: z.string().min(20),
    date_of_birth: z.date(),
    address_ktp: z.string().min(1).max(150),
    bank_name: z.string().min(1).max(50),
    account_number: z.string().min(1).max(50),
    owner_name: z.string().min(1).max(50),
    merchant_name: z.string().min(1).max(50),
    category_merchant: z.string().min(1).max(50),
    status: z.enum([
      MerchantStatus.BUKA,
      MerchantStatus.TAHAN,
      MerchantStatus.TUTUP,
    ]),
    address_line: z.string().min(1).max(50),
    city: z.string().min(1).max(50),
    state: z.string().min(1).max(50),
    postal_code: z.string().min(1).max(50),
    latitude: z.number().min(1).optional(),
    longitude: z.number().min(1).optional(),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE_MERCHANT: ZodType = z.object({
    address: z.string().min(1).max(150).optional(),
    open_time: z.string().min(1).max(10).optional(),
    close_time: z.string().min(1).max(10).optional(),
    password: z.string().min(1).max(100).optional(),
  });
  static readonly UPDATESTATUS: ZodType = z.object({
    status: z.enum([
      MerchantStatus.BUKA,
      MerchantStatus.TAHAN,
      MerchantStatus.TUTUP,
    ]),
  });
}
