import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  lugWidthMM: z.literal(true).optional(),
  buckleWidthMM: z.literal(true).optional()
}).strict();
export const StrapVariantSpecAvgAggregateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecAvgAggregateInputType>;
export const StrapVariantSpecAvgAggregateInputObjectZodSchema = makeSchema();
