import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.literal(true).optional(),
  partType: z.literal(true).optional()
}).strict();
export const PartVariantSpecMinAggregateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecMinAggregateInputType>;
export const PartVariantSpecMinAggregateInputObjectZodSchema = makeSchema();
