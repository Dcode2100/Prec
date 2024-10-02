import { z } from 'zod';

export const taskSchema = z.object({
  AccountID: z.string().optional(),
  Name: z.string().optional(),
  Mobile: z.string().optional(),
  Email: z.string().optional(),
  Balance: z.string().optional(),
  Withdraw: z.string().optional(),
  Tracker: z.string().optional(),
  Status: z.string().optional(),
  CreatedAt: z.string().optional(),
})
