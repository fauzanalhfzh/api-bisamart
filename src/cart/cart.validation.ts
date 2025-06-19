import { z, ZodType } from 'zod';

export class CartValidation {
  static readonly ADDINGTOCART: ZodType = z.object({
    customer_id: z.number().min(1).positive(),
    product_id: z.number().min(1).positive(),
    quantity: z.number().min(1).positive(),
    note: z.string().min(1).max(100),
  });
  static readonly DELETEITEM: ZodType = z.object({
    customer_id: z.number().min(1).positive(),
    product_id: z.number().min(1).positive(),
  });
}
