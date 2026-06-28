import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionWorkflowIdActionTargetTypeActionTargetIdCompoundUniqueInputObjectSchema as WorkflowExecutionWorkflowIdActionTargetTypeActionTargetIdCompoundUniqueInputObjectSchema } from './WorkflowExecutionWorkflowIdActionTargetTypeActionTargetIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  workflowId_actionTargetType_actionTargetId: z.lazy(() => WorkflowExecutionWorkflowIdActionTargetTypeActionTargetIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionWhereUniqueInput>;
export const WorkflowExecutionWhereUniqueInputObjectZodSchema = makeSchema();
