import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistSelectObjectSchema as TaskItemChecklistSelectObjectSchema } from './objects/TaskItemChecklistSelect.schema';
import { TaskItemChecklistIncludeObjectSchema as TaskItemChecklistIncludeObjectSchema } from './objects/TaskItemChecklistInclude.schema';
import { TaskItemChecklistUpdateInputObjectSchema as TaskItemChecklistUpdateInputObjectSchema } from './objects/TaskItemChecklistUpdateInput.schema';
import { TaskItemChecklistUncheckedUpdateInputObjectSchema as TaskItemChecklistUncheckedUpdateInputObjectSchema } from './objects/TaskItemChecklistUncheckedUpdateInput.schema';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './objects/TaskItemChecklistWhereUniqueInput.schema';

export const TaskItemChecklistUpdateOneSchema: z.ZodType<Prisma.TaskItemChecklistUpdateArgs> = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), data: z.union([TaskItemChecklistUpdateInputObjectSchema, TaskItemChecklistUncheckedUpdateInputObjectSchema]), where: TaskItemChecklistWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistUpdateArgs>;

export const TaskItemChecklistUpdateOneZodSchema = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), data: z.union([TaskItemChecklistUpdateInputObjectSchema, TaskItemChecklistUncheckedUpdateInputObjectSchema]), where: TaskItemChecklistWhereUniqueInputObjectSchema }).strict();