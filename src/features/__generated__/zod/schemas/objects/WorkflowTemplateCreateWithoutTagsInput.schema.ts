import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema';
import { WorkflowConditionCreateNestedManyWithoutWorkflowInputObjectSchema as WorkflowConditionCreateNestedManyWithoutWorkflowInputObjectSchema } from './WorkflowConditionCreateNestedManyWithoutWorkflowInput.schema';
import { WorkflowActionCreateNestedManyWithoutWorkflowInputObjectSchema as WorkflowActionCreateNestedManyWithoutWorkflowInputObjectSchema } from './WorkflowActionCreateNestedManyWithoutWorkflowInput.schema';
import { WorkflowExecutionCreateNestedManyWithoutWorkflowInputObjectSchema as WorkflowExecutionCreateNestedManyWithoutWorkflowInputObjectSchema } from './WorkflowExecutionCreateNestedManyWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  status: WorkflowTemplateStatusSchema.optional(),
  strategy: WorkflowConditionStrategySchema.optional(),
  ownerType: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  isSystem: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  conditions: z.lazy(() => WorkflowConditionCreateNestedManyWithoutWorkflowInputObjectSchema).optional(),
  actions: z.lazy(() => WorkflowActionCreateNestedManyWithoutWorkflowInputObjectSchema).optional(),
  executions: z.lazy(() => WorkflowExecutionCreateNestedManyWithoutWorkflowInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateCreateWithoutTagsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateWithoutTagsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateWithoutTagsInput>;
export const WorkflowTemplateCreateWithoutTagsInputObjectZodSchema = makeSchema();
