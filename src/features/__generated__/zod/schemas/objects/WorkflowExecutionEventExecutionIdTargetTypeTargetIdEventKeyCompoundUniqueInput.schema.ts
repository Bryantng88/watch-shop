import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  executionId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string()
}).strict();
export const WorkflowExecutionEventExecutionIdTargetTypeTargetIdEventKeyCompoundUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventExecutionIdTargetTypeTargetIdEventKeyCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventExecutionIdTargetTypeTargetIdEventKeyCompoundUniqueInput>;
export const WorkflowExecutionEventExecutionIdTargetTypeTargetIdEventKeyCompoundUniqueInputObjectZodSchema = makeSchema();
