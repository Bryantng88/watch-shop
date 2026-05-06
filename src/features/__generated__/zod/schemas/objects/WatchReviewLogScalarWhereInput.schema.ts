import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumWatchReviewActionFilterObjectSchema as EnumWatchReviewActionFilterObjectSchema } from './EnumWatchReviewActionFilter.schema';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { EnumWatchReviewStatusNullableFilterObjectSchema as EnumWatchReviewStatusNullableFilterObjectSchema } from './EnumWatchReviewStatusNullableFilter.schema';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { EnumWatchReviewStatusFilterObjectSchema as EnumWatchReviewStatusFilterObjectSchema } from './EnumWatchReviewStatusFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const watchreviewlogscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchReviewLogScalarWhereInputObjectSchema), z.lazy(() => WatchReviewLogScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchReviewLogScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchReviewLogScalarWhereInputObjectSchema), z.lazy(() => WatchReviewLogScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  reviewStateId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  action: z.union([z.lazy(() => EnumWatchReviewActionFilterObjectSchema), WatchReviewActionSchema]).optional(),
  fromStatus: z.union([z.lazy(() => EnumWatchReviewStatusNullableFilterObjectSchema), WatchReviewStatusSchema]).optional().nullable(),
  toStatus: z.union([z.lazy(() => EnumWatchReviewStatusFilterObjectSchema), WatchReviewStatusSchema]).optional(),
  actorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WatchReviewLogScalarWhereInputObjectSchema: z.ZodType<Prisma.WatchReviewLogScalarWhereInput> = watchreviewlogscalarwhereinputSchema as unknown as z.ZodType<Prisma.WatchReviewLogScalarWhereInput>;
export const WatchReviewLogScalarWhereInputObjectZodSchema = watchreviewlogscalarwhereinputSchema;
