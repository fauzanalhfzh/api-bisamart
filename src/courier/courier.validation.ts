import { CourierStatus } from '@prisma/client';
import { z, ZodType } from 'zod';

export class CourierValidation {
  static readonly REGISTER: ZodType = z.object({
    date_of_birth: z.preprocess((val) => new Date(val as string), z.date()),
    address_ktp: z.string().min(1).max(100),
    ktp: z.string().max(20),
    vehicle_brand: z.string().min(1).max(100),
    vehicle_color: z.string().min(1).max(100),
    registration_number: z.string().min(1).max(100),
    license_plate: z.string().min(1).max(100),
    vehicle_speed: z.preprocess((val) => Number(val), z.number()),
  });

  static readonly UPDATESTATUS: ZodType = z.object({
    status: z.enum([CourierStatus.ONLINE, CourierStatus.OFFLINE]),
  });

  static readonly LOGIN: ZodType = z.object({
    phone_number: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });
}
