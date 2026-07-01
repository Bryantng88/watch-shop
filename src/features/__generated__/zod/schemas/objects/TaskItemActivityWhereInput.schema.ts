import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumActivitySourceTypeFilterObjectSchema as EnumActivitySourceTypeFilterObjectSchema } from './EnumActivitySourceTypeFilter.schema';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumActivityStatusFilterObjectSchema as EnumActivityStatusFilterObjectSchema } from './EnumActivityStatusFilter.schema';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TaskItemScalarRelationFilterObjectSchema as TaskItemScalarRelationFilterObjectSchema } from './TaskItemScalarRelationFilter.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { TaskItemActivityReplyListRelationFilterObjectSchema as TaskItemActivityReplyListRelationFilterObjectSchema } from './TaskItemActivityReplyListRelationFilter.schema'

const taskitemactivitywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemActivityWhereInputObjectSchema), z.lazy(() => TaskItemActivityWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemActivityWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemActivityWhereInputObjectSchema), z.lazy(() => TaskItemActivityWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskItemId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sourceType: z.union([z.lazy(() => EnumActivitySourceTypeFilterObjectSchema), ActivitySourceTypeSchema]).optional(),
  sourceId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  body: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumActivityStatusFilterObjectSchema), ActivityStatusSchema]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  occurredAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  taskItem: z.union([z.lazy(() => TaskItemScalarRelationFilterObjectSchema), z.lazy(() => TaskItemWhereInputObjectSchema)]).optional(),
  actorUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  replies: z.lazy(() => TaskItemActivityReplyListRelationFilterObjectSchema).optional()
}).strict();
export const TaskItemActivityWhereInputObjectSchema: z.ZodType<Prisma.TaskItemActivityWhereInput> = taskitemactivitywhereinputSchema as unknown as z.ZodType<Prisma.TaskItemActivityWhereInput>;
export const TaskItemActivityWhereInputObjectZodSchema = taskitemactivitywhereinputSchema;
