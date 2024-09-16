import { StatusDriver, VehicleType } from '@prisma/client';
import { z, ZodType } from 'zod';

export class DriverValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    phone_number: z.string().min(1).max(50),
    email: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
    country: z.string().min(1).max(50),
    ktp: z.string().min(1).max(30),
    address_ktp: z.string().min(1).max(150),
    // ktp_img: z.string().min(1).max(100),
    vehicle_type: z.enum([VehicleType.MOTOR, VehicleType.MOBIL]),
    sim: z.string().min(1).max(30),
    // sim_img: z.string().min(1).max(100),
    // selfie_with_sim: z.string().min(1).max(100),
    vehicle_brand: z.string().min(1).max(50),
    vehicle_color: z.string().min(1).max(50),
    license_plate: z.string().min(1).max(50),
    registration_number: z.string().min(1).max(50),
    // profile_img: z.string().min(1).max(100),
  });

  static readonly UPDATESTATUS: ZodType = z.object({
    status: z.enum([StatusDriver.ACTIVE, StatusDriver.INACTIVE]),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });
}
