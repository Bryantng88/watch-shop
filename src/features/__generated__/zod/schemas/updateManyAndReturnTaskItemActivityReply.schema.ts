import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplySelectObjectSchema as TaskItemActivityReplySelectObjectSchema } from './objects/TaskItemActivityReplySelect.schema';
import { TaskItemActivityReplyUpdateManyMutationInputObjectSchema as TaskItemActivityReplyUpdateManyMutationInputObjectSchema } from './objects/TaskItemActivityReplyUpdateManyMutationInput.schema';
import { TaskItemActivityReplyWhereInputObjectSchema as TaskItemActivityReplyWhereInputObjectSchema } from './objects/TaskItemActivityReplyWhereInput.schema';

export const TaskItemActivityReplyUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskItemActivityReplyUpdateManyAndReturnArgs> = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), data: TaskItemActivityReplyUpdateManyMutationInputObjectSchema, where: TaskItemActivityReplyWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpdateManyAndReturnArgs>;

export const TaskItemActivityReplyUpdateManyAndReturnZodSchema = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), data: TaskItemActivityReplyUpdateManyMutationInputObjectSchema, where: TaskItemActivityReplyWhereInputObjectSchema.optional() }).strict();