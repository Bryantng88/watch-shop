import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionWorkflowIdEventKeyCompoundUniqueInputObjectSchema as WorkflowConditionWorkflowIdEventKeyCompoundUniqueInputObjectSchema } from './WorkflowConditionWorkflowIdEventKeyCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  workflowId_eventKey: z.lazy(() => WorkflowConditionWorkflowIdEventKeyCompoundUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowConditionWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowConditionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionWhereUniqueInput>;
export const WorkflowConditionWhereUniqueInputObjectZodSchema = makeSchema();
