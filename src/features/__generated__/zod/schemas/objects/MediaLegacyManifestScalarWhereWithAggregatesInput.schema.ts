import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumMediaLegacyClassificationWithAggregatesFilterObjectSchema as EnumMediaLegacyClassificationWithAggregatesFilterObjectSchema } from './EnumMediaLegacyClassificationWithAggregatesFilter.schema';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema';
import { EnumMediaLegacyDecisionWithAggregatesFilterObjectSchema as EnumMediaLegacyDecisionWithAggregatesFilterObjectSchema } from './EnumMediaLegacyDecisionWithAggregatesFilter.schema';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

const medialegacymanifestscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaLegacyManifestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MediaLegacyManifestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaLegacyManifestScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaLegacyManifestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MediaLegacyManifestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  legacyMediaAssetId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  legacyKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  classification: z.union([z.lazy(() => EnumMediaLegacyClassificationWithAggregatesFilterObjectSchema), MediaLegacyClassificationSchema]).optional(),
  decision: z.union([z.lazy(() => EnumMediaLegacyDecisionWithAggregatesFilterObjectSchema), MediaLegacyDecisionSchema]).optional(),
  physicalExists: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  productImageId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  movedFromKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  mediaObjectId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  scannedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  migratedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MediaLegacyManifestScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.MediaLegacyManifestScalarWhereWithAggregatesInput> = medialegacymanifestscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.MediaLegacyManifestScalarWhereWithAggregatesInput>;
export const MediaLegacyManifestScalarWhereWithAggregatesInputObjectZodSchema = medialegacymanifestscalarwherewithaggregatesinputSchema;
