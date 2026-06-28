import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumWorkflowActionTypeFilterObjectSchema as EnumWorkflowActionTypeFilterObjectSchema } from './EnumWorkflowActionTypeFilter.schema';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WorkflowTemplateScalarRelationFilterObjectSchema as WorkflowTemplateScalarRelationFilterObjectSchema } from './WorkflowTemplateScalarRelationFilter.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema'

const workflowactionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowActionWhereInputObjectSchema), z.lazy(() => WorkflowActionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowActionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowActionWhereInputObjectSchema), z.lazy(() => WorkflowActionWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workflowId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actionType: z.union([z.lazy(() => EnumWorkflowActionTypeFilterObjectSchema), WorkflowActionTypeSchema]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  configJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  workflow: z.union([z.lazy(() => WorkflowTemplateScalarRelationFilterObjectSchema), z.lazy(() => WorkflowTemplateWhereInputObjectSchema)]).optional()
}).strict();
export const WorkflowActionWhereInputObjectSchema: z.ZodType<Prisma.WorkflowActionWhereInput> = workflowactionwhereinputSchema as unknown as z.ZodType<Prisma.WorkflowActionWhereInput>;
export const WorkflowActionWhereInputObjectZodSchema = workflowactionwhereinputSchema;
