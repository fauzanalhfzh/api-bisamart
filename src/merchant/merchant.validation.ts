import { z, ZodType } from 'zod';

export class MerchantValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    phone_number: z.string().min(1).max(50),
    email: z.string().min(1).max(50),
    password: z.string().min(1).max(50),
    merchant_name: z.string().min(1).max(50),
    address: z.string().min(1).max(150),
    open_time: z.string().min(1).max(10),
    close_time: z.string().min(1).max(10),
  });
  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });
}
