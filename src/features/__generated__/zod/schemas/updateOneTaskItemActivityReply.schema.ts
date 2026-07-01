import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplySelectObjectSchema as TaskItemActivityReplySelectObjectSchema } from './objects/TaskItemActivityReplySelect.schema';
import { TaskItemActivityReplyIncludeObjectSchema as TaskItemActivityReplyIncludeObjectSchema } from './objects/TaskItemActivityReplyInclude.schema';
import { TaskItemActivityReplyUpdateInputObjectSchema as TaskItemActivityReplyUpdateInputObjectSchema } from './objects/TaskItemActivityReplyUpdateInput.schema';
import { TaskItemActivityReplyUncheckedUpdateInputObjectSchema as TaskItemActivityReplyUncheckedUpdateInputObjectSchema } from './objects/TaskItemActivityReplyUncheckedUpdateInput.schema';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './objects/TaskItemActivityReplyWhereUniqueInput.schema';

export const TaskItemActivityReplyUpdateOneSchema: z.ZodType<Prisma.TaskItemActivityReplyUpdateArgs> = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), data: z.union([TaskItemActivityReplyUpdateInputObjectSchema, TaskItemActivityReplyUncheckedUpdateInputObjectSchema]), where: TaskItemActivityReplyWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpdateArgs>;

export const TaskItemActivityReplyUpdateOneZodSchema = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), data: z.union([TaskItemActivityReplyUpdateInputObjectSchema, TaskItemActivityReplyUncheckedUpdateInputObjectSchema]), where: TaskItemActivityReplyWhereUniqueInputObjectSchema }).strict();