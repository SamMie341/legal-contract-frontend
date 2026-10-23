import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດພະນັກງານ (Username / Employee Code)'),
  password: z
    .string()
    .min(1, 'ກະລຸນາປ້ອນລະຫັດຜ່ານ (Password)'),
  isHrm: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
