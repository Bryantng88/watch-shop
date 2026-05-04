import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MediaAssetCountOrderByAggregateInputObjectSchema as MediaAssetCountOrderByAggregateInputObjectSchema } from './MediaAssetCountOrderByAggregateInput.schema';
import { MediaAssetAvgOrderByAggregateInputObjectSchema as MediaAssetAvgOrderByAggregateInputObjectSchema } from './MediaAssetAvgOrderByAggregateInput.schema';
import { MediaAssetMaxOrderByAggregateInputObjectSchema as MediaAssetMaxOrderByAggregateInputObjectSchema } from './MediaAssetMaxOrderByAggregateInput.schema';
import { MediaAssetMinOrderByAggregateInputObjectSchema as MediaAssetMinOrderByAggregateInputObjectSchema } from './MediaAssetMinOrderByAggregateInput.schema';
import { MediaAssetSumOrderByAggregateInputObjectSchema as MediaAssetSumOrderByAggregateInputObjectSchema } from './MediaAssetSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  parentPrefix: SortOrderSchema.optional(),
  fileName: SortOrderSchema.optional(),
  ext: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sizeBytes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  etag: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lastModified: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  profile: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => MediaAssetCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => MediaAssetAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MediaAssetMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MediaAssetMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => MediaAssetSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MediaAssetOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MediaAssetOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetOrderByWithAggregationInput>;
export const MediaAssetOrderByWithAggregationInputObjectZodSchema = makeSchema();
