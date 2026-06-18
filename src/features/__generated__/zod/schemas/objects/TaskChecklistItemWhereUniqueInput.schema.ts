import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TaskChecklistItemWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemWhereUniqueInput>;
export const TaskChecklistItemWhereUniqueInputObjectZodSchema = makeSchema();
