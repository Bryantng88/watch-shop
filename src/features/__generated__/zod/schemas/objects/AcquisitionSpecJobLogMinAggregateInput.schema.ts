import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  acquisitionSpecJobId: z.literal(true).optional(),
  acquisitionItemId: z.literal(true).optional(),
  acquisitionId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  stage: z.literal(true).optional(),
  level: z.literal(true).optional(),
  message: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const AcquisitionSpecJobLogMinAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogMinAggregateInputType>;
export const AcquisitionSpecJobLogMinAggregateInputObjectZodSchema = makeSchema();
