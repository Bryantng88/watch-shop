import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  workflowId: z.string(),
  eventKey: z.string()
}).strict();
export const WorkflowConditionWorkflowIdEventKeyCompoundUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowConditionWorkflowIdEventKeyCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionWorkflowIdEventKeyCompoundUniqueInput>;
export const WorkflowConditionWorkflowIdEventKeyCompoundUniqueInputObjectZodSchema = makeSchema();
