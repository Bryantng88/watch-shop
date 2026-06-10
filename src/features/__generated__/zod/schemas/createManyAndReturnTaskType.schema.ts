import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './objects/TaskTypeSelect.schema';
import { TaskTypeCreateManyInputObjectSchema as TaskTypeCreateManyInputObjectSchema } from './objects/TaskTypeCreateManyInput.schema';

export const TaskTypeCreateManyAndReturnSchema: z.ZodType<Prisma.TaskTypeCreateManyAndReturnArgs> = z.object({ select: TaskTypeSelectObjectSchema.optional(), data: z.union([ TaskTypeCreateManyInputObjectSchema, z.array(TaskTypeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskTypeCreateManyAndReturnArgs>;

export const TaskTypeCreateManyAndReturnZodSchema = z.object({ select: TaskTypeSelectObjectSchema.optional(), data: z.union([ TaskTypeCreateManyInputObjectSchema, z.array(TaskTypeCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();