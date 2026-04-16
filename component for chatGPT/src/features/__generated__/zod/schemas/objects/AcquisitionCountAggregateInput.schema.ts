import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  vendorId: z.literal(true).optional(),
  customerId: z.literal(true).optional(),
  type: z.literal(true).optional(),
  acquiredAt: z.literal(true).optional(),
  cost: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  payoutStatus: z.literal(true).optional(),
  accquisitionStt: z.literal(true).optional(),
  refNo: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  condition: z.literal(true).optional(),
  warrantyUntil: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  sentAt: z.literal(true).optional(),
  returnedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const AcquisitionCountAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCountAggregateInputType>;
export const AcquisitionCountAggregateInputObjectZodSchema = makeSchema();
