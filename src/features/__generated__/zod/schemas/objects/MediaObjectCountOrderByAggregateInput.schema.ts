import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bucket: SortOrderSchema.optional(),
  storageKey: SortOrderSchema.optional(),
  originalFileName: SortOrderSchema.optional(),
  mimeType: SortOrderSchema.optional(),
  sizeBytes: SortOrderSchema.optional(),
  checksum: SortOrderSchema.optional(),
  etag: SortOrderSchema.optional(),
  availability: SortOrderSchema.optional(),
  verifiedAt: SortOrderSchema.optional(),
  missingAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const MediaObjectCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaObjectCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectCountOrderByAggregateInput>;
export const MediaObjectCountOrderByAggregateInputObjectZodSchema = makeSchema();
