import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityCreateManyInputObjectSchema as TaskItemActivityCreateManyInputObjectSchema } from './objects/TaskItemActivityCreateManyInput.schema';

export const TaskItemActivityCreateManySchema: z.ZodType<Prisma.TaskItemActivityCreateManyArgs> = z.object({ data: z.union([ TaskItemActivityCreateManyInputObjectSchema, z.array(TaskItemActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityCreateManyArgs>;

export const TaskItemActivityCreateManyZodSchema = z.object({ data: z.union([ TaskItemActivityCreateManyInputObjectSchema, z.array(TaskItemActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();