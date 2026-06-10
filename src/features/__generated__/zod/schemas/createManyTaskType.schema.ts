import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeCreateManyInputObjectSchema as TaskTypeCreateManyInputObjectSchema } from './objects/TaskTypeCreateManyInput.schema';

export const TaskTypeCreateManySchema: z.ZodType<Prisma.TaskTypeCreateManyArgs> = z.object({ data: z.union([ TaskTypeCreateManyInputObjectSchema, z.array(TaskTypeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskTypeCreateManyArgs>;

export const TaskTypeCreateManyZodSchema = z.object({ data: z.union([ TaskTypeCreateManyInputObjectSchema, z.array(TaskTypeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();