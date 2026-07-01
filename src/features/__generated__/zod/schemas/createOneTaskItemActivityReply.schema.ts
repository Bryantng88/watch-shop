import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplySelectObjectSchema as TaskItemActivityReplySelectObjectSchema } from './objects/TaskItemActivityReplySelect.schema';
import { TaskItemActivityReplyIncludeObjectSchema as TaskItemActivityReplyIncludeObjectSchema } from './objects/TaskItemActivityReplyInclude.schema';
import { TaskItemActivityReplyCreateInputObjectSchema as TaskItemActivityReplyCreateInputObjectSchema } from './objects/TaskItemActivityReplyCreateInput.schema';
import { TaskItemActivityReplyUncheckedCreateInputObjectSchema as TaskItemActivityReplyUncheckedCreateInputObjectSchema } from './objects/TaskItemActivityReplyUncheckedCreateInput.schema';

export const TaskItemActivityReplyCreateOneSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateArgs> = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), data: z.union([TaskItemActivityReplyCreateInputObjectSchema, TaskItemActivityReplyUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateArgs>;

export const TaskItemActivityReplyCreateOneZodSchema = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), data: z.union([TaskItemActivityReplyCreateInputObjectSchema, TaskItemActivityReplyUncheckedCreateInputObjectSchema]) }).strict();