import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema'

const makeSchema = () => z.object({
  set: WorkflowTemplateStatusSchema.optional()
}).strict();
export const EnumWorkflowTemplateStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWorkflowTemplateStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkflowTemplateStatusFieldUpdateOperationsInput>;
export const EnumWorkflowTemplateStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
