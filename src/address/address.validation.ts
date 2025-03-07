import { z, ZodType } from 'zod';

export class addressValidation {
  static readonly CREATE: ZodType = z.object({
    address_line: z.string().min(1).max(100),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(30),
    latitude: z.number(),
    longitude: z.number(),
    is_primary: z.boolean(),
  });

  static readonly UPDATE: ZodType = z.object({
    address_line: z.string().min(1).max(100).optional(),
    city: z.string().min(1).max(100).optional(),
    state: z.string().min(1).max(100).optional(),
    postal_code: z.string().min(1).max(30).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    is_primary: z.boolean().optional(),
  });
}
