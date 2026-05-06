import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumWatchReviewTargetTypeFilterObjectSchema as EnumWatchReviewTargetTypeFilterObjectSchema } from './EnumWatchReviewTargetTypeFilter.schema';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { EnumWatchReviewStatusFilterObjectSchema as EnumWatchReviewStatusFilterObjectSchema } from './EnumWatchReviewStatusFilter.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WatchScalarRelationFilterObjectSchema as WatchScalarRelationFilterObjectSchema } from './WatchScalarRelationFilter.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchReviewLogListRelationFilterObjectSchema as WatchReviewLogListRelationFilterObjectSchema } from './WatchReviewLogListRelationFilter.schema'

const watchreviewstatewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchReviewStateWhereInputObjectSchema), z.lazy(() => WatchReviewStateWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchReviewStateWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchReviewStateWhereInputObjectSchema), z.lazy(() => WatchReviewStateWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => EnumWatchReviewTargetTypeFilterObjectSchema), WatchReviewTargetTypeSchema]).optional(),
  status: z.union([z.lazy(() => EnumWatchReviewStatusFilterObjectSchema), WatchReviewStatusSchema]).optional(),
  submittedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  submittedById: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reviewedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  reviewedById: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  reviewNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  watch: z.union([z.lazy(() => WatchScalarRelationFilterObjectSchema), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  WatchReviewLog: z.lazy(() => WatchReviewLogListRelationFilterObjectSchema).optional()
}).strict();
export const WatchReviewStateWhereInputObjectSchema: z.ZodType<Prisma.WatchReviewStateWhereInput> = watchreviewstatewhereinputSchema as unknown as z.ZodType<Prisma.WatchReviewStateWhereInput>;
export const WatchReviewStateWhereInputObjectZodSchema = watchreviewstatewhereinputSchema;
