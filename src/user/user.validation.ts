import { z, ZodType } from 'zod';
import { Roles } from '@prisma/client';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(1).email().max(50),
    phone_number: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
    roles: z.enum([Roles.CUSTOMER, Roles.MERCHANT, Roles.COURIER]),
  });

  static readonly LOGIN: ZodType = z.object({
    phone_number: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
  }).partial();
}
