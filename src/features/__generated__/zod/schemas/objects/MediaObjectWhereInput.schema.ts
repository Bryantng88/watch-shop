import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BigIntNullableFilterObjectSchema as BigIntNullableFilterObjectSchema } from './BigIntNullableFilter.schema';
import { EnumMediaObjectAvailabilityFilterObjectSchema as EnumMediaObjectAvailabilityFilterObjectSchema } from './EnumMediaObjectAvailabilityFilter.schema';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { MediaBindingListRelationFilterObjectSchema as MediaBindingListRelationFilterObjectSchema } from './MediaBindingListRelationFilter.schema';
import { MediaOperationListRelationFilterObjectSchema as MediaOperationListRelationFilterObjectSchema } from './MediaOperationListRelationFilter.schema'

const mediaobjectwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaObjectWhereInputObjectSchema), z.lazy(() => MediaObjectWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaObjectWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaObjectWhereInputObjectSchema), z.lazy(() => MediaObjectWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bucket: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  storageKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  originalFileName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  mimeType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sizeBytes: z.union([z.lazy(() => BigIntNullableFilterObjectSchema), z.bigint()]).optional().nullable(),
  checksum: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  etag: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  availability: z.union([z.lazy(() => EnumMediaObjectAvailabilityFilterObjectSchema), MediaObjectAvailabilitySchema]).optional(),
  verifiedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  missingAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  bindings: z.lazy(() => MediaBindingListRelationFilterObjectSchema).optional(),
  operations: z.lazy(() => MediaOperationListRelationFilterObjectSchema).optional()
}).strict();
export const MediaObjectWhereInputObjectSchema: z.ZodType<Prisma.MediaObjectWhereInput> = mediaobjectwhereinputSchema as unknown as z.ZodType<Prisma.MediaObjectWhereInput>;
export const MediaObjectWhereInputObjectZodSchema = mediaobjectwhereinputSchema;
