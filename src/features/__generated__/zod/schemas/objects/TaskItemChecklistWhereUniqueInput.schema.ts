import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TaskItemChecklistWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistWhereUniqueInput>;
export const TaskItemChecklistWhereUniqueInputObjectZodSchema = makeSchema();
