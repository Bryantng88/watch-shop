import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MediaObjectCountOrderByAggregateInputObjectSchema as MediaObjectCountOrderByAggregateInputObjectSchema } from './MediaObjectCountOrderByAggregateInput.schema';
import { MediaObjectAvgOrderByAggregateInputObjectSchema as MediaObjectAvgOrderByAggregateInputObjectSchema } from './MediaObjectAvgOrderByAggregateInput.schema';
import { MediaObjectMaxOrderByAggregateInputObjectSchema as MediaObjectMaxOrderByAggregateInputObjectSchema } from './MediaObjectMaxOrderByAggregateInput.schema';
import { MediaObjectMinOrderByAggregateInputObjectSchema as MediaObjectMinOrderByAggregateInputObjectSchema } from './MediaObjectMinOrderByAggregateInput.schema';
import { MediaObjectSumOrderByAggregateInputObjectSchema as MediaObjectSumOrderByAggregateInputObjectSchema } from './MediaObjectSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bucket: SortOrderSchema.optional(),
  storageKey: SortOrderSchema.optional(),
  originalFileName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mimeType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sizeBytes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  checksum: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  etag: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  availability: SortOrderSchema.optional(),
  verifiedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  missingAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => MediaObjectCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => MediaObjectAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => MediaObjectMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => MediaObjectMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => MediaObjectSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const MediaObjectOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.MediaObjectOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectOrderByWithAggregationInput>;
export const MediaObjectOrderByWithAggregationInputObjectZodSchema = makeSchema();
