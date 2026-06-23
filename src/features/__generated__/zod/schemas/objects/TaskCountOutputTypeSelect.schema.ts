import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  checklistItems: z.boolean().optional(),
  taskItems: z.boolean().optional(),
  executions: z.boolean().optional(),
  notifications: z.boolean().optional()
}).strict();
export const TaskCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TaskCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskCountOutputTypeSelect>;
export const TaskCountOutputTypeSelectObjectZodSchema = makeSchema();
