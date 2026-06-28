import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema'

const makeSchema = () => z.object({
  set: WorkflowConditionStrategySchema.optional()
}).strict();
export const EnumWorkflowConditionStrategyFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWorkflowConditionStrategyFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowConditionStrategyFieldUpdateOperationsInput>;
export const EnumWorkflowConditionStrategyFieldUpdateOperationsInputObjectZodSchema = makeSchema();
