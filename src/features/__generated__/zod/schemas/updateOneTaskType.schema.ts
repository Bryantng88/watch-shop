import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './objects/TaskTypeSelect.schema';
import { TaskTypeIncludeObjectSchema as TaskTypeIncludeObjectSchema } from './objects/TaskTypeInclude.schema';
import { TaskTypeUpdateInputObjectSchema as TaskTypeUpdateInputObjectSchema } from './objects/TaskTypeUpdateInput.schema';
import { TaskTypeUncheckedUpdateInputObjectSchema as TaskTypeUncheckedUpdateInputObjectSchema } from './objects/TaskTypeUncheckedUpdateInput.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './objects/TaskTypeWhereUniqueInput.schema';

export const TaskTypeUpdateOneSchema: z.ZodType<Prisma.TaskTypeUpdateArgs> = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), data: z.union([TaskTypeUpdateInputObjectSchema, TaskTypeUncheckedUpdateInputObjectSchema]), where: TaskTypeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskTypeUpdateArgs>;

export const TaskTypeUpdateOneZodSchema = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), data: z.union([TaskTypeUpdateInputObjectSchema, TaskTypeUncheckedUpdateInputObjectSchema]), where: TaskTypeWhereUniqueInputObjectSchema }).strict();