import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  type: z.literal(true).optional(),
  status: z.literal(true).optional(),
  customerId: z.literal(true).optional(),
  vendorId: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  acquisitionId: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  subTotal: z.literal(true).optional(),
  taxTotal: z.literal(true).optional(),
  discountTotal: z.literal(true).optional(),
  grandTotal: z.literal(true).optional(),
  issuedAt: z.literal(true).optional(),
  dueAt: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const InvoiceCountAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCountAggregateInputType>;
export const InvoiceCountAggregateInputObjectZodSchema = makeSchema();
