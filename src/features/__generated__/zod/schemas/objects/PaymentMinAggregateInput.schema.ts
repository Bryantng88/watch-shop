import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  method: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  paidAt: z.literal(true).optional(),
  reference: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  direction: z.literal(true).optional(),
  order_id: z.literal(true).optional(),
  service_request_id: z.literal(true).optional(),
  vendor_id: z.literal(true).optional(),
  acquisition_id: z.literal(true).optional(),
  status: z.literal(true).optional(),
  purpose: z.literal(true).optional(),
  shipment_id: z.literal(true).optional(),
  type: z.literal(true).optional()
}).strict();
export const PaymentMinAggregateInputObjectSchema: z.ZodType<Prisma.PaymentMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PaymentMinAggregateInputType>;
export const PaymentMinAggregateInputObjectZodSchema = makeSchema();
