import { UserStatus } from '@prisma/client';
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
  static readonly UPDATE_MERCHANT: ZodType = z.object({
    address: z.string().min(1).max(150).optional(),
    open_time: z.string().min(1).max(10).optional(),
    close_time: z.string().min(1).max(10).optional(),
    password: z.string().min(1).max(100).optional(),
  });
  static readonly UPDATESTATUS: ZodType = z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE]),
  });
  static readonly CREATEPRODUCT: ZodType = z.object({
    product_name: z.string().min(1).max(100),
    description: z.string().min(1).max(150).optional(),
    price: z.number().min(1),
    stock: z.number().min(1),
    category_id: z.string().min(1).max(100).optional(),
    merchant_id: z.string().min(1).max(100),
  });
  static readonly UDPATE_PRODUCT: ZodType = z.object({
    product_name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(150).optional(),
    price: z.number().min(1).optional(),
    stock: z.number().min(1).optional(),
  });
}
