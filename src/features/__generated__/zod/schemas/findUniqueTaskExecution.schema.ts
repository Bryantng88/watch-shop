import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionSelectObjectSchema as TaskExecutionSelectObjectSchema } from './objects/TaskExecutionSelect.schema';
import { TaskExecutionIncludeObjectSchema as TaskExecutionIncludeObjectSchema } from './objects/TaskExecutionInclude.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './objects/TaskExecutionWhereUniqueInput.schema';

export const TaskExecutionFindUniqueSchema: z.ZodType<Prisma.TaskExecutionFindUniqueArgs> = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), where: TaskExecutionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskExecutionFindUniqueArgs>;

export const TaskExecutionFindUniqueZodSchema = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), where: TaskExecutionWhereUniqueInputObjectSchema }).strict();