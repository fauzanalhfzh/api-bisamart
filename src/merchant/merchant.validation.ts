import { MerchantStatus } from '@prisma/client';
import { z, ZodType } from 'zod';

export class MerchantValidation {
  static readonly REGISTER: ZodType = z.object({
    merchant_category_id: z.number(),
    ktp: z.string().max(20),
    place_of_birth: z.string().max(20),
    date_of_birth: z.preprocess((val) => new Date(val as string), z.date()),
    address_ktp: z.string().min(1).max(100),
    bank_name: z.string().min(1).max(50),
    account_number: z.string().min(1).max(50),
    owner_name: z.string().min(1).max(50),
    merchant_name: z.string().min(1).max(50),
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
