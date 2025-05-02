import { z } from 'zod';
import {  passwordValidation } from './signUpSchema';

export const resetSchema = z
  .object({
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
