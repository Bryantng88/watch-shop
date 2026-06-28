import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string()
}).strict();
export const WorkflowEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowEventLogEventKeyTargetTypeTargetIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowEventLogEventKeyTargetTypeTargetIdCompoundUniqueInput>;
export const WorkflowEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectZodSchema = makeSchema();
