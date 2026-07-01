import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TaskItemActivityWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskItemActivityWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityWhereUniqueInput>;
export const TaskItemActivityWhereUniqueInputObjectZodSchema = makeSchema();
