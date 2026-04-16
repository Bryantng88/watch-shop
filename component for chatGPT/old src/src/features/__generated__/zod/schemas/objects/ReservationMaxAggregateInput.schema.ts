import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  depositAmt: z.literal(true).optional(),
  expiresAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ReservationMaxAggregateInputObjectSchema: z.ZodType<Prisma.ReservationMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ReservationMaxAggregateInputType>;
export const ReservationMaxAggregateInputObjectZodSchema = makeSchema();
