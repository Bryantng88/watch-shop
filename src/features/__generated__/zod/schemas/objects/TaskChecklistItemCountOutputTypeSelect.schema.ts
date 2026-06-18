import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  executions: z.boolean().optional()
}).strict();
export const TaskChecklistItemCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TaskChecklistItemCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCountOutputTypeSelect>;
export const TaskChecklistItemCountOutputTypeSelectObjectZodSchema = makeSchema();
