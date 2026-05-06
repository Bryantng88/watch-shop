import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  titleOverride: SortOrderSchema.optional(),
  summary: SortOrderSchema.optional(),
  hookText: SortOrderSchema.optional(),
  body: SortOrderSchema.optional(),
  bulletSpecs: SortOrderSchema.optional(),
  seoTitle: SortOrderSchema.optional(),
  seoDescription: SortOrderSchema.optional(),
  aiMetaJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  contentStatus: SortOrderSchema.optional(),
  submittedAt: SortOrderSchema.optional(),
  submittedById: SortOrderSchema.optional(),
  reviewedAt: SortOrderSchema.optional(),
  reviewedById: SortOrderSchema.optional(),
  reviewNote: SortOrderSchema.optional(),
  hashTags: SortOrderSchema.optional(),
  publishedAt: SortOrderSchema.optional(),
  publishedById: SortOrderSchema.optional()
}).strict();
export const WatchContentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchContentCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentCountOrderByAggregateInput>;
export const WatchContentCountOrderByAggregateInputObjectZodSchema = makeSchema();
