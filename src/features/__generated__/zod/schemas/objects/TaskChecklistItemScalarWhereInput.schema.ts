import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const taskchecklistitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema), z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema), z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isDone: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskChecklistItemScalarWhereInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemScalarWhereInput> = taskchecklistitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.TaskChecklistItemScalarWhereInput>;
export const TaskChecklistItemScalarWhereInputObjectZodSchema = taskchecklistitemscalarwhereinputSchema;
