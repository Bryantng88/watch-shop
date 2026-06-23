import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const taskitemchecklistscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema), z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema), z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskItemId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isDone: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  doneAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  taskId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const TaskItemChecklistScalarWhereInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistScalarWhereInput> = taskitemchecklistscalarwhereinputSchema as unknown as z.ZodType<Prisma.TaskItemChecklistScalarWhereInput>;
export const TaskItemChecklistScalarWhereInputObjectZodSchema = taskitemchecklistscalarwhereinputSchema;
