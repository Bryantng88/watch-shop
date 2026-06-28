import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema';
import { WorkflowConditionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedCreateNestedManyWithoutWorkflowInput.schema';
import { WorkflowActionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema as WorkflowActionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema } from './WorkflowActionUncheckedCreateNestedManyWithoutWorkflowInput.schema';
import { WorkflowExecutionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedCreateNestedManyWithoutWorkflowInput.schema'

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
  conditions: z.lazy(() => WorkflowConditionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema).optional(),
  actions: z.lazy(() => WorkflowActionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema).optional(),
  executions: z.lazy(() => WorkflowExecutionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateUncheckedCreateWithoutTagsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUncheckedCreateWithoutTagsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUncheckedCreateWithoutTagsInput>;
export const WorkflowTemplateUncheckedCreateWithoutTagsInputObjectZodSchema = makeSchema();
