import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './objects/TaskItemSelect.schema';
import { TaskItemCreateManyInputObjectSchema as TaskItemCreateManyInputObjectSchema } from './objects/TaskItemCreateManyInput.schema';

export const TaskItemCreateManyAndReturnSchema: z.ZodType<Prisma.TaskItemCreateManyAndReturnArgs> = z.object({ select: TaskItemSelectObjectSchema.optional(), data: z.union([ TaskItemCreateManyInputObjectSchema, z.array(TaskItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemCreateManyAndReturnArgs>;

export const TaskItemCreateManyAndReturnZodSchema = z.object({ select: TaskItemSelectObjectSchema.optional(), data: z.union([ TaskItemCreateManyInputObjectSchema, z.array(TaskItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();