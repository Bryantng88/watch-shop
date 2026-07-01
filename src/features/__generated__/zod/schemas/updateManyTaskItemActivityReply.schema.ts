import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplyUpdateManyMutationInputObjectSchema as TaskItemActivityReplyUpdateManyMutationInputObjectSchema } from './objects/TaskItemActivityReplyUpdateManyMutationInput.schema';
import { TaskItemActivityReplyWhereInputObjectSchema as TaskItemActivityReplyWhereInputObjectSchema } from './objects/TaskItemActivityReplyWhereInput.schema';

export const TaskItemActivityReplyUpdateManySchema: z.ZodType<Prisma.TaskItemActivityReplyUpdateManyArgs> = z.object({ data: TaskItemActivityReplyUpdateManyMutationInputObjectSchema, where: TaskItemActivityReplyWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpdateManyArgs>;

export const TaskItemActivityReplyUpdateManyZodSchema = z.object({ data: TaskItemActivityReplyUpdateManyMutationInputObjectSchema, where: TaskItemActivityReplyWhereInputObjectSchema.optional() }).strict();