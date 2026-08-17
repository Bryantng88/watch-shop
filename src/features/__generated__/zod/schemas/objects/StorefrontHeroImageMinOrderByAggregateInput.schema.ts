import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  storageKey: SortOrderSchema.optional(),
  derivativeKey: SortOrderSchema.optional(),
  originalFileName: SortOrderSchema.optional(),
  altText: SortOrderSchema.optional(),
  mimeType: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  focalX: SortOrderSchema.optional(),
  focalY: SortOrderSchema.optional(),
  overlayOpacity: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const StorefrontHeroImageMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StorefrontHeroImageMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StorefrontHeroImageMinOrderByAggregateInput>;
export const StorefrontHeroImageMinOrderByAggregateInputObjectZodSchema = makeSchema();
