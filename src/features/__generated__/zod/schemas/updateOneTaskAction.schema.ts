import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionSelectObjectSchema as TaskActionSelectObjectSchema } from './objects/TaskActionSelect.schema';
import { TaskActionIncludeObjectSchema as TaskActionIncludeObjectSchema } from './objects/TaskActionInclude.schema';
import { TaskActionUpdateInputObjectSchema as TaskActionUpdateInputObjectSchema } from './objects/TaskActionUpdateInput.schema';
import { TaskActionUncheckedUpdateInputObjectSchema as TaskActionUncheckedUpdateInputObjectSchema } from './objects/TaskActionUncheckedUpdateInput.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './objects/TaskActionWhereUniqueInput.schema';

export const TaskActionUpdateOneSchema: z.ZodType<Prisma.TaskActionUpdateArgs> = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), data: z.union([TaskActionUpdateInputObjectSchema, TaskActionUncheckedUpdateInputObjectSchema]), where: TaskActionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskActionUpdateArgs>;

export const TaskActionUpdateOneZodSchema = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), data: z.union([TaskActionUpdateInputObjectSchema, TaskActionUncheckedUpdateInputObjectSchema]), where: TaskActionWhereUniqueInputObjectSchema }).strict();