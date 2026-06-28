import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WorkflowTemplateScalarRelationFilterObjectSchema as WorkflowTemplateScalarRelationFilterObjectSchema } from './WorkflowTemplateScalarRelationFilter.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema'

const workflowconditionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowConditionWhereInputObjectSchema), z.lazy(() => WorkflowConditionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowConditionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowConditionWhereInputObjectSchema), z.lazy(() => WorkflowConditionWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workflowId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  configJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  workflow: z.union([z.lazy(() => WorkflowTemplateScalarRelationFilterObjectSchema), z.lazy(() => WorkflowTemplateWhereInputObjectSchema)]).optional()
}).strict();
export const WorkflowConditionWhereInputObjectSchema: z.ZodType<Prisma.WorkflowConditionWhereInput> = workflowconditionwhereinputSchema as unknown as z.ZodType<Prisma.WorkflowConditionWhereInput>;
export const WorkflowConditionWhereInputObjectZodSchema = workflowconditionwhereinputSchema;
