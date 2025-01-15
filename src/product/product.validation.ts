import { z, ZodType } from 'zod';

export class ProductValidation {
  static readonly CREATEPRODUCT: ZodType = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(150).optional(),
    price: z.number().min(1),
    stock: z.number().min(1),
    netto: z.number().min(1),
    discount: z.number().min(1).optional(),
    merchant_id: z.string().min(1).max(150),
    category_id: z.string().min(1).max(150),
  });
  static readonly UDPATE_PRODUCT: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(150).optional(),
    price: z.number().min(1).optional(),
    stock: z.number().min(1).optional(),
    netto: z.number().min(1).optional(),
    discount: z.number().min(1).optional(),
    category_id: z.string().min(1).max(150).optional(),
  });
}
