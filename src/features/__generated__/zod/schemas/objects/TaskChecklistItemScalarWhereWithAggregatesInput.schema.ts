import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const taskchecklistitemscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskChecklistItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskChecklistItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskChecklistItemScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskChecklistItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskChecklistItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isDone: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskChecklistItemScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemScalarWhereWithAggregatesInput> = taskchecklistitemscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TaskChecklistItemScalarWhereWithAggregatesInput>;
export const TaskChecklistItemScalarWhereWithAggregatesInputObjectZodSchema = taskchecklistitemscalarwherewithaggregatesinputSchema;
