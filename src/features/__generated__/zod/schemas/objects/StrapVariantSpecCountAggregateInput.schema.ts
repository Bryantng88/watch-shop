import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  variantId: z.literal(true).optional(),
  widthMM: z.literal(true).optional(),
  lengthLabel: z.literal(true).optional(),
  color: z.literal(true).optional(),
  material: z.literal(true).optional(),
  quickRelease: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const StrapVariantSpecCountAggregateInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCountAggregateInputType>;
export const StrapVariantSpecCountAggregateInputObjectZodSchema = makeSchema();
