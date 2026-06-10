import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumWorkCaseScopeWithAggregatesFilterObjectSchema as EnumWorkCaseScopeWithAggregatesFilterObjectSchema } from './EnumWorkCaseScopeWithAggregatesFilter.schema';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { EnumWorkCaseStatusWithAggregatesFilterObjectSchema as EnumWorkCaseStatusWithAggregatesFilterObjectSchema } from './EnumWorkCaseStatusWithAggregatesFilter.schema';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { EnumTaskPriorityWithAggregatesFilterObjectSchema as EnumTaskPriorityWithAggregatesFilterObjectSchema } from './EnumTaskPriorityWithAggregatesFilter.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const workcasescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkCaseScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkCaseScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkCaseScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkCaseScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkCaseScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  refNo: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumWorkCaseScopeWithAggregatesFilterObjectSchema), WorkCaseScopeSchema]).optional(),
  status: z.union([z.lazy(() => EnumWorkCaseStatusWithAggregatesFilterObjectSchema), WorkCaseStatusSchema]).optional(),
  priority: z.union([z.lazy(() => EnumTaskPriorityWithAggregatesFilterObjectSchema), TaskPrioritySchema]).optional(),
  watchId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  categoryId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  raisedByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  assignedToUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  triagedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  resolvedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  cancelledAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkCaseScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WorkCaseScalarWhereWithAggregatesInput> = workcasescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WorkCaseScalarWhereWithAggregatesInput>;
export const WorkCaseScalarWhereWithAggregatesInputObjectZodSchema = workcasescalarwherewithaggregatesinputSchema;
