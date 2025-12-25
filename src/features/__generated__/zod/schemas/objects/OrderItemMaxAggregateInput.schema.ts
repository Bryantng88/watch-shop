import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  variantId: z.literal(true).optional(),
  title: z.literal(true).optional(),
  listPrice: z.literal(true).optional(),
  discountType: z.literal(true).optional(),
  discountValue: z.literal(true).optional(),
  unitPriceAgreed: z.literal(true).optional(),
  taxRate: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  subtotal: z.literal(true).optional(),
  img: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const OrderItemMaxAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemMaxAggregateInputType>;
export const OrderItemMaxAggregateInputObjectZodSchema = makeSchema();
