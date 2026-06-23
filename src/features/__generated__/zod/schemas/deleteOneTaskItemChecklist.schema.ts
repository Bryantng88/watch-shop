import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistSelectObjectSchema as TaskItemChecklistSelectObjectSchema } from './objects/TaskItemChecklistSelect.schema';
import { TaskItemChecklistIncludeObjectSchema as TaskItemChecklistIncludeObjectSchema } from './objects/TaskItemChecklistInclude.schema';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './objects/TaskItemChecklistWhereUniqueInput.schema';

export const TaskItemChecklistDeleteOneSchema: z.ZodType<Prisma.TaskItemChecklistDeleteArgs> = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), where: TaskItemChecklistWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistDeleteArgs>;

export const TaskItemChecklistDeleteOneZodSchema = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), where: TaskItemChecklistWhereUniqueInputObjectSchema }).strict();