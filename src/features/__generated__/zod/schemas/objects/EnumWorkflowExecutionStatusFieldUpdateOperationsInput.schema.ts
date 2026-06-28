import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema'

const makeSchema = () => z.object({
  set: WorkflowExecutionStatusSchema.optional()
}).strict();
export const EnumWorkflowExecutionStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWorkflowExecutionStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowExecutionStatusFieldUpdateOperationsInput>;
export const EnumWorkflowExecutionStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
