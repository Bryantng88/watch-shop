import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { EnumWorkflowTemplateStatusFieldUpdateOperationsInputObjectSchema as EnumWorkflowTemplateStatusFieldUpdateOperationsInputObjectSchema } from './EnumWorkflowTemplateStatusFieldUpdateOperationsInput.schema';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema';
import { EnumWorkflowConditionStrategyFieldUpdateOperationsInputObjectSchema as EnumWorkflowConditionStrategyFieldUpdateOperationsInputObjectSchema } from './EnumWorkflowConditionStrategyFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { WorkflowConditionUpdateManyWithoutWorkflowNestedInputObjectSchema as WorkflowConditionUpdateManyWithoutWorkflowNestedInputObjectSchema } from './WorkflowConditionUpdateManyWithoutWorkflowNestedInput.schema';
import { WorkflowActionUpdateManyWithoutWorkflowNestedInputObjectSchema as WorkflowActionUpdateManyWithoutWorkflowNestedInputObjectSchema } from './WorkflowActionUpdateManyWithoutWorkflowNestedInput.schema';
import { WorkflowExecutionUpdateManyWithoutWorkflowNestedInputObjectSchema as WorkflowExecutionUpdateManyWithoutWorkflowNestedInputObjectSchema } from './WorkflowExecutionUpdateManyWithoutWorkflowNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  status: z.union([WorkflowTemplateStatusSchema, z.lazy(() => EnumWorkflowTemplateStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  strategy: z.union([WorkflowConditionStrategySchema, z.lazy(() => EnumWorkflowConditionStrategyFieldUpdateOperationsInputObjectSchema)]).optional(),
  ownerType: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  ownerId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isSystem: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  conditions: z.lazy(() => WorkflowConditionUpdateManyWithoutWorkflowNestedInputObjectSchema).optional(),
  actions: z.lazy(() => WorkflowActionUpdateManyWithoutWorkflowNestedInputObjectSchema).optional(),
  executions: z.lazy(() => WorkflowExecutionUpdateManyWithoutWorkflowNestedInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateUpdateWithoutTagsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUpdateWithoutTagsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateWithoutTagsInput>;
export const WorkflowTemplateUpdateWithoutTagsInputObjectZodSchema = makeSchema();
