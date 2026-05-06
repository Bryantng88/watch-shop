import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringNullableListFilterObjectSchema as StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumContentStatusFilterObjectSchema as EnumContentStatusFilterObjectSchema } from './EnumContentStatusFilter.schema';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { WatchScalarRelationFilterObjectSchema as WatchScalarRelationFilterObjectSchema } from './WatchScalarRelationFilter.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const watchcontentwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchContentWhereInputObjectSchema), z.lazy(() => WatchContentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchContentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchContentWhereInputObjectSchema), z.lazy(() => WatchContentWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  titleOverride: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  summary: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  hookText: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  body: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  bulletSpecs: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  seoTitle: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  seoDescription: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  aiMetaJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  contentStatus: z.union([z.lazy(() => EnumContentStatusFilterObjectSchema), ContentStatusSchema]).optional(),
  submittedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  submittedById: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reviewedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  reviewedById: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reviewNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  hashTags: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  publishedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  publishedById: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  watch: z.union([z.lazy(() => WatchScalarRelationFilterObjectSchema), z.lazy(() => WatchWhereInputObjectSchema)]).optional()
}).strict();
export const WatchContentWhereInputObjectSchema: z.ZodType<Prisma.WatchContentWhereInput> = watchcontentwhereinputSchema as unknown as z.ZodType<Prisma.WatchContentWhereInput>;
export const WatchContentWhereInputObjectZodSchema = watchcontentwhereinputSchema;
