import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskSelectObjectSchema as TaskSelectObjectSchema } from './objects/TaskSelect.schema';
import { TaskIncludeObjectSchema as TaskIncludeObjectSchema } from './objects/TaskInclude.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';

export const TaskDeleteOneSchema: z.ZodType<Prisma.TaskDeleteArgs> = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), where: TaskWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskDeleteArgs>;

export const TaskDeleteOneZodSchema = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), where: TaskWhereUniqueInputObjectSchema }).strict();