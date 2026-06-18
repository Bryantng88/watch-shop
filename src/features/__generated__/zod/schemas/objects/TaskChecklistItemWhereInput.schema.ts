import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TaskScalarRelationFilterObjectSchema as TaskScalarRelationFilterObjectSchema } from './TaskScalarRelationFilter.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema';
import { TaskExecutionListRelationFilterObjectSchema as TaskExecutionListRelationFilterObjectSchema } from './TaskExecutionListRelationFilter.schema'

const taskchecklistitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskChecklistItemWhereInputObjectSchema), z.lazy(() => TaskChecklistItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskChecklistItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskChecklistItemWhereInputObjectSchema), z.lazy(() => TaskChecklistItemWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isDone: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  task: z.union([z.lazy(() => TaskScalarRelationFilterObjectSchema), z.lazy(() => TaskWhereInputObjectSchema)]).optional(),
  executions: z.lazy(() => TaskExecutionListRelationFilterObjectSchema).optional()
}).strict();
export const TaskChecklistItemWhereInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemWhereInput> = taskchecklistitemwhereinputSchema as unknown as z.ZodType<Prisma.TaskChecklistItemWhereInput>;
export const TaskChecklistItemWhereInputObjectZodSchema = taskchecklistitemwhereinputSchema;
