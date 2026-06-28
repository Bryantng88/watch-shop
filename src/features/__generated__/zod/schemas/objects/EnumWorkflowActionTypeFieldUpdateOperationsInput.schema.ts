import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema'

const makeSchema = () => z.object({
  set: WorkflowActionTypeSchema.optional()
}).strict();
export const EnumWorkflowActionTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWorkflowActionTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowActionTypeFieldUpdateOperationsInput>;
export const EnumWorkflowActionTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
