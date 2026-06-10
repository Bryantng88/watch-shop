import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionSelectObjectSchema as TaskExecutionSelectObjectSchema } from './objects/TaskExecutionSelect.schema';
import { TaskExecutionCreateManyInputObjectSchema as TaskExecutionCreateManyInputObjectSchema } from './objects/TaskExecutionCreateManyInput.schema';

export const TaskExecutionCreateManyAndReturnSchema: z.ZodType<Prisma.TaskExecutionCreateManyAndReturnArgs> = z.object({ select: TaskExecutionSelectObjectSchema.optional(), data: z.union([ TaskExecutionCreateManyInputObjectSchema, z.array(TaskExecutionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskExecutionCreateManyAndReturnArgs>;

export const TaskExecutionCreateManyAndReturnZodSchema = z.object({ select: TaskExecutionSelectObjectSchema.optional(), data: z.union([ TaskExecutionCreateManyInputObjectSchema, z.array(TaskExecutionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();