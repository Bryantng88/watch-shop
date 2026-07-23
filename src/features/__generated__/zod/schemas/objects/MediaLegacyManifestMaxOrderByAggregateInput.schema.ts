import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  legacyMediaAssetId: SortOrderSchema.optional(),
  legacyKey: SortOrderSchema.optional(),
  classification: SortOrderSchema.optional(),
  decision: SortOrderSchema.optional(),
  physicalExists: SortOrderSchema.optional(),
  productImageId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  acquisitionId: SortOrderSchema.optional(),
  movedFromKey: SortOrderSchema.optional(),
  mediaObjectId: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  scannedAt: SortOrderSchema.optional(),
  migratedAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const MediaLegacyManifestMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaLegacyManifestMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaLegacyManifestMaxOrderByAggregateInput>;
export const MediaLegacyManifestMaxOrderByAggregateInputObjectZodSchema = makeSchema();
