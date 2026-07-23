import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  legacyMediaAssetId: z.literal(true).optional(),
  legacyKey: z.literal(true).optional(),
  classification: z.literal(true).optional(),
  decision: z.literal(true).optional(),
  physicalExists: z.literal(true).optional(),
  productImageId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  acquisitionId: z.literal(true).optional(),
  movedFromKey: z.literal(true).optional(),
  mediaObjectId: z.literal(true).optional(),
  note: z.literal(true).optional(),
  scannedAt: z.literal(true).optional(),
  migratedAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const MediaLegacyManifestCountAggregateInputObjectSchema: z.ZodType<Prisma.MediaLegacyManifestCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaLegacyManifestCountAggregateInputType>;
export const MediaLegacyManifestCountAggregateInputObjectZodSchema = makeSchema();
