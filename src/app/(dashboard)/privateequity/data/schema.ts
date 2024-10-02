import { z } from 'zod'

export const taskSchema = z.object({
  token: z.string().optional(),
  symbol: z.string().optional(),
  price: z.string().optional(),
  wishlist: z.number().nullable().optional(),
  dpQty: z.number().nullable().optional(),
  availableLots: z.number().nullable().optional(),
  transferPending: z.number().nullable().optional(),
  sourceQty: z.number().nullable().optional(),
  state: z.string().optional(),
})
