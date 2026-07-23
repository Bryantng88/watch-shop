import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  legacyMediaAssetId: SortOrderSchema.optional(),
  legacyKey: SortOrderSchema.optional(),
  classification: SortOrderSchema.optional(),
  decision: SortOrderSchema.optional(),
  physicalExists: SortOrderSchema.optional(),
  productImageId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  acquisitionId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movedFromKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mediaObjectId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scannedAt: SortOrderSchema.optional(),
  migratedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const MediaLegacyManifestOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MediaLegacyManifestOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaLegacyManifestOrderByWithRelationInput>;
export const MediaLegacyManifestOrderByWithRelationInputObjectZodSchema = makeSchema();
