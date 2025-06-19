import { z, ZodType } from 'zod';

export class PromoValidation {
  static readonly CREATEPROMO: ZodType = z.object({
    code: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
    discount_amount: z.number().min(1),
    usage_limit: z.number().min(1),
  });
}

