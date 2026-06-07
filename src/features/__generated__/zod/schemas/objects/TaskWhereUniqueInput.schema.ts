import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TaskWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskWhereUniqueInput>;
export const TaskWhereUniqueInputObjectZodSchema = makeSchema();
