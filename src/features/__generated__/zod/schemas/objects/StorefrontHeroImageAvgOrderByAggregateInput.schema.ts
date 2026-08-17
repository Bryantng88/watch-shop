import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sizeBytes: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  focalX: SortOrderSchema.optional(),
  focalY: SortOrderSchema.optional(),
  overlayOpacity: SortOrderSchema.optional()
}).strict();
export const StorefrontHeroImageAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StorefrontHeroImageAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StorefrontHeroImageAvgOrderByAggregateInput>;
export const StorefrontHeroImageAvgOrderByAggregateInputObjectZodSchema = makeSchema();
