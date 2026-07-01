import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivitySelectObjectSchema as TaskItemActivitySelectObjectSchema } from './objects/TaskItemActivitySelect.schema';
import { TaskItemActivityCreateManyInputObjectSchema as TaskItemActivityCreateManyInputObjectSchema } from './objects/TaskItemActivityCreateManyInput.schema';

export const TaskItemActivityCreateManyAndReturnSchema: z.ZodType<Prisma.TaskItemActivityCreateManyAndReturnArgs> = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), data: z.union([ TaskItemActivityCreateManyInputObjectSchema, z.array(TaskItemActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityCreateManyAndReturnArgs>;

export const TaskItemActivityCreateManyAndReturnZodSchema = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), data: z.union([ TaskItemActivityCreateManyInputObjectSchema, z.array(TaskItemActivityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();