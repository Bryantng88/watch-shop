import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplyWhereInputObjectSchema as TaskItemActivityReplyWhereInputObjectSchema } from './objects/TaskItemActivityReplyWhereInput.schema';

export const TaskItemActivityReplyDeleteManySchema: z.ZodType<Prisma.TaskItemActivityReplyDeleteManyArgs> = z.object({ where: TaskItemActivityReplyWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyDeleteManyArgs>;

export const TaskItemActivityReplyDeleteManyZodSchema = z.object({ where: TaskItemActivityReplyWhereInputObjectSchema.optional() }).strict();