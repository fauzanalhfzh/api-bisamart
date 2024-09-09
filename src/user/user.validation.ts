import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    phone_number: z.string().min(1).max(50),
    email: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
  });
}
