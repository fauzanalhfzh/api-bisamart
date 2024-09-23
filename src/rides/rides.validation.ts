import { RidesStatus } from '@prisma/client';
import { z, ZodType } from 'zod';

export class RidesValidation {
  static readonly NEWRIDE: ZodType = z.object({
    user_id: z.number().positive().min(1),
    driver_id: z.number().positive().min(1),
    current_location_name: z.string().min(1).max(150),
    destination_location_name: z.string().min(1).max(150),
    distance: z.number().positive().min(1),
    rating: z.number().min(1).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    status: z.enum([
      RidesStatus.PENDING,
      RidesStatus.ACCEPTED,
      RidesStatus.COMPLETED,
      RidesStatus.CANCELLED,
    ]),
  });
}
