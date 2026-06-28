import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema as EnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema } from './EnumWorkflowTemplateStatusWithAggregatesFilter.schema';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { EnumWorkflowConditionStrategyWithAggregatesFilterObjectSchema as EnumWorkflowConditionStrategyWithAggregatesFilterObjectSchema } from './EnumWorkflowConditionStrategyWithAggregatesFilter.schema';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const workflowtemplatescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkflowTemplateScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkflowTemplateScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkflowTemplateScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkflowTemplateScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkflowTemplateScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumWorkflowTemplateStatusWithAggregatesFilterObjectSchema), WorkflowTemplateStatusSchema]).optional(),
  strategy: z.union([z.lazy(() => EnumWorkflowConditionStrategyWithAggregatesFilterObjectSchema), WorkflowConditionStrategySchema]).optional(),
  ownerType: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  ownerId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isSystem: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkflowTemplateScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateScalarWhereWithAggregatesInput> = workflowtemplatescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WorkflowTemplateScalarWhereWithAggregatesInput>;
export const WorkflowTemplateScalarWhereWithAggregatesInputObjectZodSchema = workflowtemplatescalarwherewithaggregatesinputSchema;
