import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumWorkflowTemplateStatusFilterObjectSchema as EnumWorkflowTemplateStatusFilterObjectSchema } from './EnumWorkflowTemplateStatusFilter.schema';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { EnumWorkflowConditionStrategyFilterObjectSchema as EnumWorkflowConditionStrategyFilterObjectSchema } from './EnumWorkflowConditionStrategyFilter.schema';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WorkflowConditionListRelationFilterObjectSchema as WorkflowConditionListRelationFilterObjectSchema } from './WorkflowConditionListRelationFilter.schema';
import { WorkflowActionListRelationFilterObjectSchema as WorkflowActionListRelationFilterObjectSchema } from './WorkflowActionListRelationFilter.schema';
import { WorkflowExecutionListRelationFilterObjectSchema as WorkflowExecutionListRelationFilterObjectSchema } from './WorkflowExecutionListRelationFilter.schema';
import { AppTagListRelationFilterObjectSchema as AppTagListRelationFilterObjectSchema } from './AppTagListRelationFilter.schema'

const workflowtemplatewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowTemplateWhereInputObjectSchema), z.lazy(() => WorkflowTemplateWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowTemplateWhereInputObjectSchema), z.lazy(() => WorkflowTemplateWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumWorkflowTemplateStatusFilterObjectSchema), WorkflowTemplateStatusSchema]).optional(),
  strategy: z.union([z.lazy(() => EnumWorkflowConditionStrategyFilterObjectSchema), WorkflowConditionStrategySchema]).optional(),
  ownerType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  ownerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isSystem: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  conditions: z.lazy(() => WorkflowConditionListRelationFilterObjectSchema).optional(),
  actions: z.lazy(() => WorkflowActionListRelationFilterObjectSchema).optional(),
  executions: z.lazy(() => WorkflowExecutionListRelationFilterObjectSchema).optional(),
  tags: z.lazy(() => AppTagListRelationFilterObjectSchema).optional()
}).strict();
export const WorkflowTemplateWhereInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateWhereInput> = workflowtemplatewhereinputSchema as unknown as z.ZodType<Prisma.WorkflowTemplateWhereInput>;
export const WorkflowTemplateWhereInputObjectZodSchema = workflowtemplatewhereinputSchema;
