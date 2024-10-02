import { z } from 'zod'

export const taskSchema = z.object({
  gui_id: z.string().optional(),
  name: z.string().optional(),
  price: z.number().optional(),
  tentative_start_date: z.string().optional(),
  subscribed_value: z.number().nullable().optional(),
  available_quantity: z.number().nullable().optional(),
  tenure: z.number().nullable().optional(),
  min_order_value: z.number().nullable().optional(),
  active: z.boolean().optional(),
  status: z.string().optional(),
})
