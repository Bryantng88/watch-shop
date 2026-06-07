import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskSelectObjectSchema as TaskSelectObjectSchema } from './objects/TaskSelect.schema';
import { TaskCreateManyInputObjectSchema as TaskCreateManyInputObjectSchema } from './objects/TaskCreateManyInput.schema';

export const TaskCreateManyAndReturnSchema: z.ZodType<Prisma.TaskCreateManyAndReturnArgs> = z.object({ select: TaskSelectObjectSchema.optional(), data: z.union([ TaskCreateManyInputObjectSchema, z.array(TaskCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskCreateManyAndReturnArgs>;

export const TaskCreateManyAndReturnZodSchema = z.object({ select: TaskSelectObjectSchema.optional(), data: z.union([ TaskCreateManyInputObjectSchema, z.array(TaskCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();