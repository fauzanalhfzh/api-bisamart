import { KurirStatus } from '@prisma/client';
import { z, ZodType } from 'zod';

export class CourierValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().min(1).max(50).email(),
    phone_number: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
    date_of_birth: z.date(),
    address_ktp: z.string().min(1).max(150),
    ktp: z.string().min(1).max(30),
    vehicle_brand: z.string().min(1).max(50),
    vehicle_color: z.string().min(1).max(50),
    vehicle_speed: z.number(),
    registration_number: z.string().min(1).max(50),
    license_plate: z.string().min(1).max(50),
  });

  static readonly UPDATESTATUS: ZodType = z.object({
    status: z.enum([KurirStatus.ONLINE, KurirStatus.OFFLINE]),
  });

  static readonly LOGIN: ZodType = z.object({
    phone_number: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });
}
