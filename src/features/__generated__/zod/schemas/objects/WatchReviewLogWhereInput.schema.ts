import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumWatchReviewActionFilterObjectSchema as EnumWatchReviewActionFilterObjectSchema } from './EnumWatchReviewActionFilter.schema';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { EnumWatchReviewStatusNullableFilterObjectSchema as EnumWatchReviewStatusNullableFilterObjectSchema } from './EnumWatchReviewStatusNullableFilter.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { EnumWatchReviewStatusFilterObjectSchema as EnumWatchReviewStatusFilterObjectSchema } from './EnumWatchReviewStatusFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WatchReviewStateScalarRelationFilterObjectSchema as WatchReviewStateScalarRelationFilterObjectSchema } from './WatchReviewStateScalarRelationFilter.schema';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './WatchReviewStateWhereInput.schema'

const watchreviewlogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchReviewLogWhereInputObjectSchema), z.lazy(() => WatchReviewLogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchReviewLogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchReviewLogWhereInputObjectSchema), z.lazy(() => WatchReviewLogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  reviewStateId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  action: z.union([z.lazy(() => EnumWatchReviewActionFilterObjectSchema), WatchReviewActionSchema]).optional(),
  fromStatus: z.union([z.lazy(() => EnumWatchReviewStatusNullableFilterObjectSchema), WatchReviewStatusSchema]).optional().nullable(),
  toStatus: z.union([z.lazy(() => EnumWatchReviewStatusFilterObjectSchema), WatchReviewStatusSchema]).optional(),
  actorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  reviewState: z.union([z.lazy(() => WatchReviewStateScalarRelationFilterObjectSchema), z.lazy(() => WatchReviewStateWhereInputObjectSchema)]).optional()
}).strict();
export const WatchReviewLogWhereInputObjectSchema: z.ZodType<Prisma.WatchReviewLogWhereInput> = watchreviewlogwhereinputSchema as unknown as z.ZodType<Prisma.WatchReviewLogWhereInput>;
export const WatchReviewLogWhereInputObjectZodSchema = watchreviewlogwhereinputSchema;
