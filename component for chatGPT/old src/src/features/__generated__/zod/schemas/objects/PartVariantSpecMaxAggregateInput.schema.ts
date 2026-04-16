import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.literal(true).optional(),
  partType: z.literal(true).optional()
}).strict();
export const PartVariantSpecMaxAggregateInputObjectSchema: z.ZodType<Prisma.PartVariantSpecMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecMaxAggregateInputType>;
export const PartVariantSpecMaxAggregateInputObjectZodSchema = makeSchema();
