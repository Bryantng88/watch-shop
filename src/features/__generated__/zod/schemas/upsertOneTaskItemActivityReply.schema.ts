import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplySelectObjectSchema as TaskItemActivityReplySelectObjectSchema } from './objects/TaskItemActivityReplySelect.schema';
import { TaskItemActivityReplyIncludeObjectSchema as TaskItemActivityReplyIncludeObjectSchema } from './objects/TaskItemActivityReplyInclude.schema';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './objects/TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyCreateInputObjectSchema as TaskItemActivityReplyCreateInputObjectSchema } from './objects/TaskItemActivityReplyCreateInput.schema';
import { TaskItemActivityReplyUncheckedCreateInputObjectSchema as TaskItemActivityReplyUncheckedCreateInputObjectSchema } from './objects/TaskItemActivityReplyUncheckedCreateInput.schema';
import { TaskItemActivityReplyUpdateInputObjectSchema as TaskItemActivityReplyUpdateInputObjectSchema } from './objects/TaskItemActivityReplyUpdateInput.schema';
import { TaskItemActivityReplyUncheckedUpdateInputObjectSchema as TaskItemActivityReplyUncheckedUpdateInputObjectSchema } from './objects/TaskItemActivityReplyUncheckedUpdateInput.schema';

export const TaskItemActivityReplyUpsertOneSchema: z.ZodType<Prisma.TaskItemActivityReplyUpsertArgs> = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), where: TaskItemActivityReplyWhereUniqueInputObjectSchema, create: z.union([ TaskItemActivityReplyCreateInputObjectSchema, TaskItemActivityReplyUncheckedCreateInputObjectSchema ]), update: z.union([ TaskItemActivityReplyUpdateInputObjectSchema, TaskItemActivityReplyUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpsertArgs>;

export const TaskItemActivityReplyUpsertOneZodSchema = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), include: TaskItemActivityReplyIncludeObjectSchema.optional(), where: TaskItemActivityReplyWhereUniqueInputObjectSchema, create: z.union([ TaskItemActivityReplyCreateInputObjectSchema, TaskItemActivityReplyUncheckedCreateInputObjectSchema ]), update: z.union([ TaskItemActivityReplyUpdateInputObjectSchema, TaskItemActivityReplyUncheckedUpdateInputObjectSchema ]) }).strict();