import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  workflowId: z.string(),
  actionTargetType: z.string(),
  actionTargetId: z.string()
}).strict();
export const WorkflowExecutionWorkflowIdActionTargetTypeActionTargetIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionWorkflowIdActionTargetTypeActionTargetIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionWorkflowIdActionTargetTypeActionTargetIdCompoundUniqueInput>;
export const WorkflowExecutionWorkflowIdActionTargetTypeActionTargetIdCompoundUniqueInputObjectZodSchema = makeSchema();
