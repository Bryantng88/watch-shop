import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  acquisitionItemId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  attempts: z.literal(true).optional(),
  lastError: z.literal(true).optional(),
  startedAt: z.literal(true).optional(),
  finishedAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  runAfter: z.literal(true).optional(),
  priority: z.literal(true).optional()
}).strict();
export const AcquisitionSpecJobMinAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobMinAggregateInputType>;
export const AcquisitionSpecJobMinAggregateInputObjectZodSchema = makeSchema();
