import { OrderStatus } from '@prisma/client';
import { z, ZodType } from 'zod';

export class RidesValidation {
  static readonly NEWRIDE: ZodType = z.object({
    user_id: z.string(),
    driver_id: z.string(),
    coupon_id: z.string().optional(),
    current_location_name: z.string().min(1).max(150),
    destination_location_name: z.string().min(1).max(150),
    distance: z.number().positive().min(1),
    rating: z.number().min(1).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    status: z.enum([
      OrderStatus.PENDING,
      OrderStatus.ACCEPTED,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
    ]),
  });
}
