import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionSelectObjectSchema as TaskExecutionSelectObjectSchema } from './objects/TaskExecutionSelect.schema';
import { TaskExecutionIncludeObjectSchema as TaskExecutionIncludeObjectSchema } from './objects/TaskExecutionInclude.schema';
import { TaskExecutionUpdateInputObjectSchema as TaskExecutionUpdateInputObjectSchema } from './objects/TaskExecutionUpdateInput.schema';
import { TaskExecutionUncheckedUpdateInputObjectSchema as TaskExecutionUncheckedUpdateInputObjectSchema } from './objects/TaskExecutionUncheckedUpdateInput.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './objects/TaskExecutionWhereUniqueInput.schema';

export const TaskExecutionUpdateOneSchema: z.ZodType<Prisma.TaskExecutionUpdateArgs> = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), data: z.union([TaskExecutionUpdateInputObjectSchema, TaskExecutionUncheckedUpdateInputObjectSchema]), where: TaskExecutionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskExecutionUpdateArgs>;

export const TaskExecutionUpdateOneZodSchema = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), data: z.union([TaskExecutionUpdateInputObjectSchema, TaskExecutionUncheckedUpdateInputObjectSchema]), where: TaskExecutionWhereUniqueInputObjectSchema }).strict();