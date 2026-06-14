import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  tasks: z.boolean().optional(),
  taskAction: z.boolean().optional()
}).strict();
export const TaskTypeCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TaskTypeCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeCountOutputTypeSelect>;
export const TaskTypeCountOutputTypeSelectObjectZodSchema = makeSchema();
