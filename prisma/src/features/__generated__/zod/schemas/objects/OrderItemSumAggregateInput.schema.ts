import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  price: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  subtotal: z.literal(true).optional()
}).strict();
export const OrderItemSumAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemSumAggregateInputType>;
export const OrderItemSumAggregateInputObjectZodSchema = makeSchema();
