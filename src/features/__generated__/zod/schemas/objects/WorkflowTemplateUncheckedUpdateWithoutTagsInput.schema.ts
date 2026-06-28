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
import { WorkflowConditionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema as WorkflowConditionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema } from './WorkflowConditionUncheckedUpdateManyWithoutWorkflowNestedInput.schema';
import { WorkflowActionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema as WorkflowActionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema } from './WorkflowActionUncheckedUpdateManyWithoutWorkflowNestedInput.schema';
import { WorkflowExecutionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema as WorkflowExecutionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema } from './WorkflowExecutionUncheckedUpdateManyWithoutWorkflowNestedInput.schema'

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
  conditions: z.lazy(() => WorkflowConditionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema).optional(),
  actions: z.lazy(() => WorkflowActionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema).optional(),
  executions: z.lazy(() => WorkflowExecutionUncheckedUpdateManyWithoutWorkflowNestedInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateUncheckedUpdateWithoutTagsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateUncheckedUpdateWithoutTagsInput>;
export const WorkflowTemplateUncheckedUpdateWithoutTagsInputObjectZodSchema = makeSchema();
