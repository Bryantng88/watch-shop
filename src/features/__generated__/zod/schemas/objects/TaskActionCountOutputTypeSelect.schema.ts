import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  tasks: z.boolean().optional()
}).strict();
export const TaskActionCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TaskActionCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCountOutputTypeSelect>;
export const TaskActionCountOutputTypeSelectObjectZodSchema = makeSchema();
