import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemCreateManyInputObjectSchema as TaskItemCreateManyInputObjectSchema } from './objects/TaskItemCreateManyInput.schema';

export const TaskItemCreateManySchema: z.ZodType<Prisma.TaskItemCreateManyArgs> = z.object({ data: z.union([ TaskItemCreateManyInputObjectSchema, z.array(TaskItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemCreateManyArgs>;

export const TaskItemCreateManyZodSchema = z.object({ data: z.union([ TaskItemCreateManyInputObjectSchema, z.array(TaskItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();