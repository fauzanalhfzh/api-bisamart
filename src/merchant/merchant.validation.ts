import { DayOfWeek, MerchantStatus } from '@prisma/client';
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

  static readonly CREATEOPERATINGHOURS: ZodType = z.object({
    merchant_id: z.number(),
    DayOfWeek: z.enum([
      DayOfWeek.SENIN,
      DayOfWeek.SELASA,
      DayOfWeek.RABU,
      DayOfWeek.KAMIS,
      DayOfWeek.JUMAT,
      DayOfWeek.SABTU,
      DayOfWeek.MINGGU,
    ]),
    is_24_hours: z.boolean(),
    open_time: z.string().min(1).max(7).optional(),
    close_time: z.string().min(1).max(7).optional(),
  });

  static readonly UPDATESTATUS: ZodType = z.object({
    status: z.enum([
      MerchantStatus.BUKA,
      MerchantStatus.TAHAN,
      MerchantStatus.TUTUP,
    ]),
  });
}
