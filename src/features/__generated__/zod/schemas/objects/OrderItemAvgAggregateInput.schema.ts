import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  listPriceAtOrder: z.literal(true).optional(),
  discountValue: z.literal(true).optional(),
  unitPriceAgreed: z.literal(true).optional(),
  taxRate: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  subtotal: z.literal(true).optional()
}).strict();
export const OrderItemAvgAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemAvgAggregateInputType>;
export const OrderItemAvgAggregateInputObjectZodSchema = makeSchema();
