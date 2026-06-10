import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionSelectObjectSchema as TaskExecutionSelectObjectSchema } from './objects/TaskExecutionSelect.schema';
import { TaskExecutionIncludeObjectSchema as TaskExecutionIncludeObjectSchema } from './objects/TaskExecutionInclude.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './objects/TaskExecutionWhereUniqueInput.schema';

export const TaskExecutionFindUniqueOrThrowSchema: z.ZodType<Prisma.TaskExecutionFindUniqueOrThrowArgs> = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), where: TaskExecutionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskExecutionFindUniqueOrThrowArgs>;

export const TaskExecutionFindUniqueOrThrowZodSchema = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), where: TaskExecutionWhereUniqueInputObjectSchema }).strict();