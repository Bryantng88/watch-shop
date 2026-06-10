import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionCreateManyInputObjectSchema as TaskExecutionCreateManyInputObjectSchema } from './objects/TaskExecutionCreateManyInput.schema';

export const TaskExecutionCreateManySchema: z.ZodType<Prisma.TaskExecutionCreateManyArgs> = z.object({ data: z.union([ TaskExecutionCreateManyInputObjectSchema, z.array(TaskExecutionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskExecutionCreateManyArgs>;

export const TaskExecutionCreateManyZodSchema = z.object({ data: z.union([ TaskExecutionCreateManyInputObjectSchema, z.array(TaskExecutionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();