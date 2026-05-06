import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumWatchReviewTargetTypeFilterObjectSchema as EnumWatchReviewTargetTypeFilterObjectSchema } from './EnumWatchReviewTargetTypeFilter.schema';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { EnumWatchReviewStatusFilterObjectSchema as EnumWatchReviewStatusFilterObjectSchema } from './EnumWatchReviewStatusFilter.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const watchreviewstatescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchReviewStateScalarWhereInputObjectSchema), z.lazy(() => WatchReviewStateScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchReviewStateScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchReviewStateScalarWhereInputObjectSchema), z.lazy(() => WatchReviewStateScalarWhereInputObjectSchema).array()]).optional(),
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
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WatchReviewStateScalarWhereInputObjectSchema: z.ZodType<Prisma.WatchReviewStateScalarWhereInput> = watchreviewstatescalarwhereinputSchema as unknown as z.ZodType<Prisma.WatchReviewStateScalarWhereInput>;
export const WatchReviewStateScalarWhereInputObjectZodSchema = watchreviewstatescalarwhereinputSchema;
