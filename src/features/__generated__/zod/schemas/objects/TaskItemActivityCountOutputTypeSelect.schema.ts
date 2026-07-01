import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  replies: z.boolean().optional()
}).strict();
export const TaskItemActivityCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TaskItemActivityCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCountOutputTypeSelect>;
export const TaskItemActivityCountOutputTypeSelectObjectZodSchema = makeSchema();
