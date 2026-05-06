import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumWatchReviewActionWithAggregatesFilterObjectSchema as EnumWatchReviewActionWithAggregatesFilterObjectSchema } from './EnumWatchReviewActionWithAggregatesFilter.schema';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { EnumWatchReviewStatusNullableWithAggregatesFilterObjectSchema as EnumWatchReviewStatusNullableWithAggregatesFilterObjectSchema } from './EnumWatchReviewStatusNullableWithAggregatesFilter.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { EnumWatchReviewStatusWithAggregatesFilterObjectSchema as EnumWatchReviewStatusWithAggregatesFilterObjectSchema } from './EnumWatchReviewStatusWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const watchreviewlogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchReviewLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchReviewLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchReviewLogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchReviewLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WatchReviewLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  reviewStateId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  action: z.union([z.lazy(() => EnumWatchReviewActionWithAggregatesFilterObjectSchema), WatchReviewActionSchema]).optional(),
  fromStatus: z.union([z.lazy(() => EnumWatchReviewStatusNullableWithAggregatesFilterObjectSchema), WatchReviewStatusSchema]).optional().nullable(),
  toStatus: z.union([z.lazy(() => EnumWatchReviewStatusWithAggregatesFilterObjectSchema), WatchReviewStatusSchema]).optional(),
  actorId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WatchReviewLogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WatchReviewLogScalarWhereWithAggregatesInput> = watchreviewlogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WatchReviewLogScalarWhereWithAggregatesInput>;
export const WatchReviewLogScalarWhereWithAggregatesInputObjectZodSchema = watchreviewlogscalarwherewithaggregatesinputSchema;
