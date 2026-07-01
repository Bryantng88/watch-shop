import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivitySelectObjectSchema as TaskItemActivitySelectObjectSchema } from './objects/TaskItemActivitySelect.schema';
import { TaskItemActivityIncludeObjectSchema as TaskItemActivityIncludeObjectSchema } from './objects/TaskItemActivityInclude.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './objects/TaskItemActivityWhereUniqueInput.schema';

export const TaskItemActivityDeleteOneSchema: z.ZodType<Prisma.TaskItemActivityDeleteArgs> = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), where: TaskItemActivityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityDeleteArgs>;

export const TaskItemActivityDeleteOneZodSchema = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), where: TaskItemActivityWhereUniqueInputObjectSchema }).strict();