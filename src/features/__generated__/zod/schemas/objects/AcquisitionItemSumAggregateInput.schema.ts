import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  unitCost: z.literal(true).optional()
}).strict();
export const AcquisitionItemSumAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemSumAggregateInputType>;
export const AcquisitionItemSumAggregateInputObjectZodSchema = makeSchema();
