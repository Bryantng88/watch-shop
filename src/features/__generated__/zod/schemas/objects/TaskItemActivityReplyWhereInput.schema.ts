import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TaskItemActivityScalarRelationFilterObjectSchema as TaskItemActivityScalarRelationFilterObjectSchema } from './TaskItemActivityScalarRelationFilter.schema';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './TaskItemActivityWhereInput.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const taskitemactivityreplywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemActivityReplyWhereInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemActivityReplyWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemActivityReplyWhereInputObjectSchema), z.lazy(() => TaskItemActivityReplyWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  activityId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  body: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  activity: z.union([z.lazy(() => TaskItemActivityScalarRelationFilterObjectSchema), z.lazy(() => TaskItemActivityWhereInputObjectSchema)]).optional(),
  actorUser: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional()
}).strict();
export const TaskItemActivityReplyWhereInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyWhereInput> = taskitemactivityreplywhereinputSchema as unknown as z.ZodType<Prisma.TaskItemActivityReplyWhereInput>;
export const TaskItemActivityReplyWhereInputObjectZodSchema = taskitemactivityreplywhereinputSchema;
