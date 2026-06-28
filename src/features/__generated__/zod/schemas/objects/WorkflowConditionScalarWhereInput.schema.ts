import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const workflowconditionscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowConditionScalarWhereInputObjectSchema), z.lazy(() => WorkflowConditionScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowConditionScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowConditionScalarWhereInputObjectSchema), z.lazy(() => WorkflowConditionScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workflowId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  configJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkflowConditionScalarWhereInputObjectSchema: z.ZodType<Prisma.WorkflowConditionScalarWhereInput> = workflowconditionscalarwhereinputSchema as unknown as z.ZodType<Prisma.WorkflowConditionScalarWhereInput>;
export const WorkflowConditionScalarWhereInputObjectZodSchema = workflowconditionscalarwhereinputSchema;
