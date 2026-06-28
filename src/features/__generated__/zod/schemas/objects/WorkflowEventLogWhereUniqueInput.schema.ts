import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectSchema as WorkflowEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectSchema } from './WorkflowEventLogEventKeyTargetTypeTargetIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  eventKey_targetType_targetId: z.lazy(() => WorkflowEventLogEventKeyTargetTypeTargetIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowEventLogWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowEventLogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowEventLogWhereUniqueInput>;
export const WorkflowEventLogWhereUniqueInputObjectZodSchema = makeSchema();
