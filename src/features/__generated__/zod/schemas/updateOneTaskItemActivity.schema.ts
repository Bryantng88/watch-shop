import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivitySelectObjectSchema as TaskItemActivitySelectObjectSchema } from './objects/TaskItemActivitySelect.schema';
import { TaskItemActivityIncludeObjectSchema as TaskItemActivityIncludeObjectSchema } from './objects/TaskItemActivityInclude.schema';
import { TaskItemActivityUpdateInputObjectSchema as TaskItemActivityUpdateInputObjectSchema } from './objects/TaskItemActivityUpdateInput.schema';
import { TaskItemActivityUncheckedUpdateInputObjectSchema as TaskItemActivityUncheckedUpdateInputObjectSchema } from './objects/TaskItemActivityUncheckedUpdateInput.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './objects/TaskItemActivityWhereUniqueInput.schema';

export const TaskItemActivityUpdateOneSchema: z.ZodType<Prisma.TaskItemActivityUpdateArgs> = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), data: z.union([TaskItemActivityUpdateInputObjectSchema, TaskItemActivityUncheckedUpdateInputObjectSchema]), where: TaskItemActivityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateArgs>;

export const TaskItemActivityUpdateOneZodSchema = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), data: z.union([TaskItemActivityUpdateInputObjectSchema, TaskItemActivityUncheckedUpdateInputObjectSchema]), where: TaskItemActivityWhereUniqueInputObjectSchema }).strict();