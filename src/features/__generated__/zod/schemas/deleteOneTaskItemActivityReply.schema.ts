import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplySelectObjectSchema as TaskItemActivityReplySelectObjectSchema } from './objects/TaskItemActivityReplySelect.schema';
import { TaskItemActivityReplyIncludeObjectSchema as TaskItemActivityReplyIncludeObjectSchema } from './objects/TaskItemActivityReplyInclude.schema';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './objects/TaskItemActivityReplyWhereUniqueInput.schema';

export const TaskItemActivityReplyDeleteOneSchema: z.ZodType<Prisma.TaskItemActivityReplyDeleteArgs> = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), where: TaskItemActivityReplyWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyDeleteArgs>;

export const TaskItemActivityReplyDeleteOneZodSchema = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), where: TaskItemActivityReplyWhereUniqueInputObjectSchema }).strict();