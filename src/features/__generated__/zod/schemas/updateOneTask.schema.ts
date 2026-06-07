import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskSelectObjectSchema as TaskSelectObjectSchema } from './objects/TaskSelect.schema';
import { TaskIncludeObjectSchema as TaskIncludeObjectSchema } from './objects/TaskInclude.schema';
import { TaskUpdateInputObjectSchema as TaskUpdateInputObjectSchema } from './objects/TaskUpdateInput.schema';
import { TaskUncheckedUpdateInputObjectSchema as TaskUncheckedUpdateInputObjectSchema } from './objects/TaskUncheckedUpdateInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';

export const TaskUpdateOneSchema: z.ZodType<Prisma.TaskUpdateArgs> = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), data: z.union([TaskUpdateInputObjectSchema, TaskUncheckedUpdateInputObjectSchema]), where: TaskWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskUpdateArgs>;

export const TaskUpdateOneZodSchema = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), data: z.union([TaskUpdateInputObjectSchema, TaskUncheckedUpdateInputObjectSchema]), where: TaskWhereUniqueInputObjectSchema }).strict();