import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityReplyCreateManyInputObjectSchema as TaskItemActivityReplyCreateManyInputObjectSchema } from './objects/TaskItemActivityReplyCreateManyInput.schema';

export const TaskItemActivityReplyCreateManySchema: z.ZodType<Prisma.TaskItemActivityReplyCreateManyArgs> = z.object({ data: z.union([ TaskItemActivityReplyCreateManyInputObjectSchema, z.array(TaskItemActivityReplyCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateManyArgs>;

export const TaskItemActivityReplyCreateManyZodSchema = z.object({ data: z.union([ TaskItemActivityReplyCreateManyInputObjectSchema, z.array(TaskItemActivityReplyCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();