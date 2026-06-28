import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  events: z.boolean().optional()
}).strict();
export const WorkflowExecutionCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.WorkflowExecutionCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionCountOutputTypeSelect>;
export const WorkflowExecutionCountOutputTypeSelectObjectZodSchema = makeSchema();
