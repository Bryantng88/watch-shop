import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  variantId: z.string().optional().nullable(),
  title: z.string(),
  listPriceAtOrder: z.number(),
  discountType: z.string().optional().nullable(),
  discountValue: z.number().optional().nullable(),
  unitPriceAgreed: z.number(),
  taxRate: z.number().optional().nullable(),
  quantity: z.number().int(),
  subtotal: z.number(),
  img: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const OrderItemCreateManyProductInputObjectSchema: z.ZodType<Prisma.OrderItemCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyProductInput>;
export const OrderItemCreateManyProductInputObjectZodSchema = makeSchema();
