import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TaskExecutionWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskExecutionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionWhereUniqueInput>;
export const TaskExecutionWhereUniqueInputObjectZodSchema = makeSchema();
