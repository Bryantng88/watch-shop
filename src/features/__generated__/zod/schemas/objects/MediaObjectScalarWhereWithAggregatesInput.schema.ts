import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { BigIntNullableWithAggregatesFilterObjectSchema as BigIntNullableWithAggregatesFilterObjectSchema } from './BigIntNullableWithAggregatesFilter.schema';
import { EnumMediaObjectAvailabilityWithAggregatesFilterObjectSchema as EnumMediaObjectAvailabilityWithAggregatesFilterObjectSchema } from './EnumMediaObjectAvailabilityWithAggregatesFilter.schema';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const mediaobjectscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaObjectScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MediaObjectScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaObjectScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaObjectScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MediaObjectScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  bucket: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  storageKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  originalFileName: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  mimeType: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sizeBytes: z.union([z.lazy(() => BigIntNullableWithAggregatesFilterObjectSchema), z.bigint()]).optional().nullable(),
  checksum: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  etag: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  availability: z.union([z.lazy(() => EnumMediaObjectAvailabilityWithAggregatesFilterObjectSchema), MediaObjectAvailabilitySchema]).optional(),
  verifiedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  missingAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MediaObjectScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.MediaObjectScalarWhereWithAggregatesInput> = mediaobjectscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.MediaObjectScalarWhereWithAggregatesInput>;
export const MediaObjectScalarWhereWithAggregatesInputObjectZodSchema = mediaobjectscalarwherewithaggregatesinputSchema;
