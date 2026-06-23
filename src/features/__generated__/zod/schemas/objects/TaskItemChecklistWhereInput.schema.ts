import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TaskItemScalarRelationFilterObjectSchema as TaskItemScalarRelationFilterObjectSchema } from './TaskItemScalarRelationFilter.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema';
import { TaskNullableScalarRelationFilterObjectSchema as TaskNullableScalarRelationFilterObjectSchema } from './TaskNullableScalarRelationFilter.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema'

const taskitemchecklistwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemChecklistWhereInputObjectSchema), z.lazy(() => TaskItemChecklistWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemChecklistWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemChecklistWhereInputObjectSchema), z.lazy(() => TaskItemChecklistWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskItemId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isDone: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  doneAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  taskId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  taskItem: z.union([z.lazy(() => TaskItemScalarRelationFilterObjectSchema), z.lazy(() => TaskItemWhereInputObjectSchema)]).optional(),
  Task: z.union([z.lazy(() => TaskNullableScalarRelationFilterObjectSchema), z.lazy(() => TaskWhereInputObjectSchema)]).optional()
}).strict();
export const TaskItemChecklistWhereInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistWhereInput> = taskitemchecklistwhereinputSchema as unknown as z.ZodType<Prisma.TaskItemChecklistWhereInput>;
export const TaskItemChecklistWhereInputObjectZodSchema = taskitemchecklistwhereinputSchema;
