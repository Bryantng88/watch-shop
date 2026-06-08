import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const TaskTypeWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskTypeWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeWhereUniqueInput>;
export const TaskTypeWhereUniqueInputObjectZodSchema = makeSchema();
