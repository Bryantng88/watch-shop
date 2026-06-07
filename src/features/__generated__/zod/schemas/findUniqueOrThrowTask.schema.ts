import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskSelectObjectSchema as TaskSelectObjectSchema } from './objects/TaskSelect.schema';
import { TaskIncludeObjectSchema as TaskIncludeObjectSchema } from './objects/TaskInclude.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';

export const TaskFindUniqueOrThrowSchema: z.ZodType<Prisma.TaskFindUniqueOrThrowArgs> = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), where: TaskWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskFindUniqueOrThrowArgs>;

export const TaskFindUniqueOrThrowZodSchema = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), where: TaskWhereUniqueInputObjectSchema }).strict();