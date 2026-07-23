import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  legacyMediaAssetId: z.string(),
  legacyKey: z.string(),
  classification: MediaLegacyClassificationSchema,
  decision: MediaLegacyDecisionSchema.optional(),
  physicalExists: z.boolean(),
  productImageId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  acquisitionId: z.string().optional().nullable(),
  movedFromKey: z.string().optional().nullable(),
  mediaObjectId: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  scannedAt: z.coerce.date().optional(),
  migratedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const MediaLegacyManifestCreateManyInputObjectSchema: z.ZodType<Prisma.MediaLegacyManifestCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaLegacyManifestCreateManyInput>;
export const MediaLegacyManifestCreateManyInputObjectZodSchema = makeSchema();
