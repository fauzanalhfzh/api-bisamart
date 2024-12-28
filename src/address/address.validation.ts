import { AddressTag } from '@prisma/client';
import { z, ZodType } from 'zod';

export class addressValidation {
  static readonly CREATE: ZodType = z.object({
    user_id: z.string().min(1),
    address_line: z.string().min(1).max(100),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(30),
    latitude: z.number(),
    longitude: z.number(),
    is_primary: z.boolean(),
    tag: z.enum([AddressTag.RUMAH, AddressTag.KANTOR]),
  });

  static readonly UPDATE: ZodType = z.object({
    user_id: z.string().min(1).optional(),
    address_line: z.string().min(1).max(100).optional(),
    city: z.string().min(1).max(100).optional(),
    state: z.string().min(1).max(100).optional(),
    postal_code: z.string().min(1).max(30).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    is_primary: z.boolean().optional(),
    tag: z.enum([AddressTag.RUMAH, AddressTag.KANTOR]).optional(),
  });
}
