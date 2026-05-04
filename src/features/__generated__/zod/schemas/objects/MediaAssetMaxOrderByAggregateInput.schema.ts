import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  parentPrefix: SortOrderSchema.optional(),
  fileName: SortOrderSchema.optional(),
  ext: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional(),
  etag: SortOrderSchema.optional(),
  lastModified: SortOrderSchema.optional(),
  profile: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const MediaAssetMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaAssetMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaAssetMaxOrderByAggregateInput>;
export const MediaAssetMaxOrderByAggregateInputObjectZodSchema = makeSchema();
