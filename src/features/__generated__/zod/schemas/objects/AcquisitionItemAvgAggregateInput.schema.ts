import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  unitCost: z.literal(true).optional(),
  warrantyMonths: z.literal(true).optional()
}).strict();
export const AcquisitionItemAvgAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemAvgAggregateInputType>;
export const AcquisitionItemAvgAggregateInputObjectZodSchema = makeSchema();
