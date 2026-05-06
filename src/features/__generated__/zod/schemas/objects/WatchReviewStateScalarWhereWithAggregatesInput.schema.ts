import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumWatchReviewTargetTypeWithAggregatesFilterObjectSchema as EnumWatchReviewTargetTypeWithAggregatesFilterObjectSchema } from './EnumWatchReviewTargetTypeWithAggregatesFilter.schema';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { EnumWatchReviewStatusWithAggregatesFilterObjectSchema as EnumWatchReviewStatusWithAggregatesFilterObjectSchema } from './EnumWatchReviewStatusWithAggregatesFilter.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const watchreviewstatescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchReviewStateScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchReviewStateScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchReviewStateScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchReviewStateScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchReviewStateScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => EnumWatchReviewTargetTypeWithAggregatesFilterObjectSchema), WatchReviewTargetTypeSchema]).optional(),
  status: z.union([z.lazy(() => EnumWatchReviewStatusWithAggregatesFilterObjectSchema), WatchReviewStatusSchema]).optional(),
  submittedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  submittedById: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  reviewedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  reviewedById: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  reviewNote: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WatchReviewStateScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WatchReviewStateScalarWhereWithAggregatesInput> = watchreviewstatescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WatchReviewStateScalarWhereWithAggregatesInput>;
export const WatchReviewStateScalarWhereWithAggregatesInputObjectZodSchema = watchreviewstatescalarwherewithaggregatesinputSchema;
