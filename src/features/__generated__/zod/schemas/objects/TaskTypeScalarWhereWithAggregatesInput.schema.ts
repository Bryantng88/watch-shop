import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumTaskDomainWithAggregatesFilterObjectSchema as EnumTaskDomainWithAggregatesFilterObjectSchema } from './EnumTaskDomainWithAggregatesFilter.schema';
import { TaskDomainSchema } from '../enums/TaskDomain.schema';
import { EnumTaskKindWithAggregatesFilterObjectSchema as EnumTaskKindWithAggregatesFilterObjectSchema } from './EnumTaskKindWithAggregatesFilter.schema';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { EnumTaskPriorityWithAggregatesFilterObjectSchema as EnumTaskPriorityWithAggregatesFilterObjectSchema } from './EnumTaskPriorityWithAggregatesFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { EnumTaskCompletionModeWithAggregatesFilterObjectSchema as EnumTaskCompletionModeWithAggregatesFilterObjectSchema } from './EnumTaskCompletionModeWithAggregatesFilter.schema';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const tasktypescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskTypeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskTypeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskTypeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskTypeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskTypeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  domain: z.union([z.lazy(() => EnumTaskDomainWithAggregatesFilterObjectSchema), TaskDomainSchema]).optional(),
  legacyKind: z.union([z.lazy(() => EnumTaskKindWithAggregatesFilterObjectSchema), TaskKindSchema]).optional(),
  defaultPriority: z.union([z.lazy(() => EnumTaskPriorityWithAggregatesFilterObjectSchema), TaskPrioritySchema]).optional(),
  completionMode: z.union([z.lazy(() => EnumTaskCompletionModeWithAggregatesFilterObjectSchema), TaskCompletionModeSchema]).optional(),
  completionRuleKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskTypeScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TaskTypeScalarWhereWithAggregatesInput> = tasktypescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TaskTypeScalarWhereWithAggregatesInput>;
export const TaskTypeScalarWhereWithAggregatesInputObjectZodSchema = tasktypescalarwherewithaggregatesinputSchema;
