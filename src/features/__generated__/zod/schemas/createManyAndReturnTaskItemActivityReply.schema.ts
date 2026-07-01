import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplySelectObjectSchema as TaskItemActivityReplySelectObjectSchema } from './objects/TaskItemActivityReplySelect.schema';
import { TaskItemActivityReplyCreateManyInputObjectSchema as TaskItemActivityReplyCreateManyInputObjectSchema } from './objects/TaskItemActivityReplyCreateManyInput.schema';

export const TaskItemActivityReplyCreateManyAndReturnSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateManyAndReturnArgs> = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), data: z.union([ TaskItemActivityReplyCreateManyInputObjectSchema, z.array(TaskItemActivityReplyCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateManyAndReturnArgs>;

export const TaskItemActivityReplyCreateManyAndReturnZodSchema = z.object({ select: TaskItemActivityReplySelectObjectSchema.optional(), data: z.union([ TaskItemActivityReplyCreateManyInputObjectSchema, z.array(TaskItemActivityReplyCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();