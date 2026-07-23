import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumMediaLegacyClassificationFilterObjectSchema as EnumMediaLegacyClassificationFilterObjectSchema } from './EnumMediaLegacyClassificationFilter.schema';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema';
import { EnumMediaLegacyDecisionFilterObjectSchema as EnumMediaLegacyDecisionFilterObjectSchema } from './EnumMediaLegacyDecisionFilter.schema';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

const medialegacymanifestwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaLegacyManifestWhereInputObjectSchema), z.lazy(() => MediaLegacyManifestWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaLegacyManifestWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaLegacyManifestWhereInputObjectSchema), z.lazy(() => MediaLegacyManifestWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  legacyMediaAssetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  legacyKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  classification: z.union([z.lazy(() => EnumMediaLegacyClassificationFilterObjectSchema), MediaLegacyClassificationSchema]).optional(),
  decision: z.union([z.lazy(() => EnumMediaLegacyDecisionFilterObjectSchema), MediaLegacyDecisionSchema]).optional(),
  physicalExists: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  productImageId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  movedFromKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  mediaObjectId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  scannedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  migratedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MediaLegacyManifestWhereInputObjectSchema: z.ZodType<Prisma.MediaLegacyManifestWhereInput> = medialegacymanifestwhereinputSchema as unknown as z.ZodType<Prisma.MediaLegacyManifestWhereInput>;
export const MediaLegacyManifestWhereInputObjectZodSchema = medialegacymanifestwhereinputSchema;
