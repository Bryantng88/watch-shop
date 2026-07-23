import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  legacyMediaAssetId: z.boolean().optional(),
  legacyKey: z.boolean().optional(),
  classification: z.boolean().optional(),
  decision: z.boolean().optional(),
  physicalExists: z.boolean().optional(),
  productImageId: z.boolean().optional(),
  productId: z.boolean().optional(),
  acquisitionId: z.boolean().optional(),
  movedFromKey: z.boolean().optional(),
  mediaObjectId: z.boolean().optional(),
  note: z.boolean().optional(),
  scannedAt: z.boolean().optional(),
  migratedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const MediaLegacyManifestSelectObjectSchema: z.ZodType<Prisma.MediaLegacyManifestSelect> = makeSchema() as unknown as z.ZodType<Prisma.MediaLegacyManifestSelect>;
export const MediaLegacyManifestSelectObjectZodSchema = makeSchema();
