import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  executions: z.boolean().optional(),
  checklists: z.boolean().optional(),
  activities: z.boolean().optional()
}).strict();
export const TaskItemCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TaskItemCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCountOutputTypeSelect>;
export const TaskItemCountOutputTypeSelectObjectZodSchema = makeSchema();
