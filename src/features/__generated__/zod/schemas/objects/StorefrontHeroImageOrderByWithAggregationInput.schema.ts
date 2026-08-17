import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StorefrontHeroImageCountOrderByAggregateInputObjectSchema as StorefrontHeroImageCountOrderByAggregateInputObjectSchema } from './StorefrontHeroImageCountOrderByAggregateInput.schema';
import { StorefrontHeroImageAvgOrderByAggregateInputObjectSchema as StorefrontHeroImageAvgOrderByAggregateInputObjectSchema } from './StorefrontHeroImageAvgOrderByAggregateInput.schema';
import { StorefrontHeroImageMaxOrderByAggregateInputObjectSchema as StorefrontHeroImageMaxOrderByAggregateInputObjectSchema } from './StorefrontHeroImageMaxOrderByAggregateInput.schema';
import { StorefrontHeroImageMinOrderByAggregateInputObjectSchema as StorefrontHeroImageMinOrderByAggregateInputObjectSchema } from './StorefrontHeroImageMinOrderByAggregateInput.schema';
import { StorefrontHeroImageSumOrderByAggregateInputObjectSchema as StorefrontHeroImageSumOrderByAggregateInputObjectSchema } from './StorefrontHeroImageSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  storageKey: SortOrderSchema.optional(),
  derivativeKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  originalFileName: SortOrderSchema.optional(),
  altText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mimeType: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  focalX: SortOrderSchema.optional(),
  focalY: SortOrderSchema.optional(),
  overlayOpacity: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => StorefrontHeroImageCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => StorefrontHeroImageAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => StorefrontHeroImageMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => StorefrontHeroImageMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => StorefrontHeroImageSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const StorefrontHeroImageOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.StorefrontHeroImageOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.StorefrontHeroImageOrderByWithAggregationInput>;
export const StorefrontHeroImageOrderByWithAggregationInputObjectZodSchema = makeSchema();
