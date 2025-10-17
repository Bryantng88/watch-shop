import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  invoiceId: z.literal(true).optional(),
  method: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  paidAt: z.literal(true).optional(),
  reference: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const PaymentMinAggregateInputObjectSchema: z.ZodType<Prisma.PaymentMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PaymentMinAggregateInputType>;
export const PaymentMinAggregateInputObjectZodSchema = makeSchema();
