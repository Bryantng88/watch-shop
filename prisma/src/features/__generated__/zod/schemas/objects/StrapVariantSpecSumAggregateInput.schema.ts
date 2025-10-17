import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  widthMM: z.literal(true).optional()
}).strict();
export const StrapVariantSpecSumAggregateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecSumAggregateInputType>;
export const StrapVariantSpecSumAggregateInputObjectZodSchema = makeSchema();
