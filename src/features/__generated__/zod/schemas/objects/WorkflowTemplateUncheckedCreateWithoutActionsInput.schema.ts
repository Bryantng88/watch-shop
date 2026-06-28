import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema';
import { WorkflowConditionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedCreateNestedManyWithoutWorkflowInput.schema';
import { WorkflowExecutionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedCreateNestedManyWithoutWorkflowInput.schema';
import { AppTagUncheckedCreateNestedManyWithoutWorkflowTemplateInputObjectSchema as AppTagUncheckedCreateNestedManyWithoutWorkflowTemplateInputObjectSchema } from './AppTagUncheckedCreateNestedManyWithoutWorkflowTemplateInput.schema'

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
  executions: z.lazy(() => WorkflowExecutionUncheckedCreateNestedManyWithoutWorkflowInputObjectSchema).optional(),
  tags: z.lazy(() => AppTagUncheckedCreateNestedManyWithoutWorkflowTemplateInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateUncheckedCreateWithoutActionsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUncheckedCreateWithoutActionsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUncheckedCreateWithoutActionsInput>;
export const WorkflowTemplateUncheckedCreateWithoutActionsInputObjectZodSchema = makeSchema();
