import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TaskItemWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskItemWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemWhereUniqueInput>;
export const TaskItemWhereUniqueInputObjectZodSchema = makeSchema();
