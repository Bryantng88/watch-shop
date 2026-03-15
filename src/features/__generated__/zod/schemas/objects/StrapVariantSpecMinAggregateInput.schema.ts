import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.literal(true).optional(),
  color: z.literal(true).optional(),
  material: z.literal(true).optional(),
  quickRelease: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  lugWidthMM: z.literal(true).optional(),
  buckleWidthMM: z.literal(true).optional()
}).strict();
export const StrapVariantSpecMinAggregateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecMinAggregateInputType>;
export const StrapVariantSpecMinAggregateInputObjectZodSchema = makeSchema();
