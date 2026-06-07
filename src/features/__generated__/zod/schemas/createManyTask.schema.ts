import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskCreateManyInputObjectSchema as TaskCreateManyInputObjectSchema } from './objects/TaskCreateManyInput.schema';

export const TaskCreateManySchema: z.ZodType<Prisma.TaskCreateManyArgs> = z.object({ data: z.union([ TaskCreateManyInputObjectSchema, z.array(TaskCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskCreateManyArgs>;

export const TaskCreateManyZodSchema = z.object({ data: z.union([ TaskCreateManyInputObjectSchema, z.array(TaskCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();