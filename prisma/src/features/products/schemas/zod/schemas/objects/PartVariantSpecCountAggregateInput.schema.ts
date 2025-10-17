import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.literal(true).optional(),
  partType: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const PartVariantSpecCountAggregateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecCountAggregateInputType>;
export const PartVariantSpecCountAggregateInputObjectZodSchema = makeSchema();
