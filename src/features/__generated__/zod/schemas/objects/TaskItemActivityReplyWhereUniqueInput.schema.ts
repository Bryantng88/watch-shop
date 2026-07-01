import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const TaskItemActivityReplyWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyWhereUniqueInput>;
export const TaskItemActivityReplyWhereUniqueInputObjectZodSchema = makeSchema();
