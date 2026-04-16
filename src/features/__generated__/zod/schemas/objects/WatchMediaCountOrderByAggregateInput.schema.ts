import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  legacyProductImageId: SortOrderSchema.optional(),
  key: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  alt: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  height: SortOrderSchema.optional(),
  mime: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional(),
  dominantHex: SortOrderSchema.optional(),
  contentHash: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WatchMediaCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchMediaCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaCountOrderByAggregateInput>;
export const WatchMediaCountOrderByAggregateInputObjectZodSchema = makeSchema();
