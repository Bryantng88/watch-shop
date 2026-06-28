import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventExecutionIdTargetTypeTargetIdEventKeyCompoundUniqueInputObjectSchema as WorkflowExecutionEventExecutionIdTargetTypeTargetIdEventKeyCompoundUniqueInputObjectSchema } from './WorkflowExecutionEventExecutionIdTargetTypeTargetIdEventKeyCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  executionId_targetType_targetId_eventKey: z.lazy(() => WorkflowExecutionEventExecutionIdTargetTypeTargetIdEventKeyCompoundUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventWhereUniqueInput>;
export const WorkflowExecutionEventWhereUniqueInputObjectZodSchema = makeSchema();
