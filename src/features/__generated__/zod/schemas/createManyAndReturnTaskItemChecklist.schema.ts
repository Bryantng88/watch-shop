import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistSelectObjectSchema as TaskItemChecklistSelectObjectSchema } from './objects/TaskItemChecklistSelect.schema';
import { TaskItemChecklistCreateManyInputObjectSchema as TaskItemChecklistCreateManyInputObjectSchema } from './objects/TaskItemChecklistCreateManyInput.schema';

export const TaskItemChecklistCreateManyAndReturnSchema: z.ZodType<Prisma.TaskItemChecklistCreateManyAndReturnArgs> = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), data: z.union([ TaskItemChecklistCreateManyInputObjectSchema, z.array(TaskItemChecklistCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateManyAndReturnArgs>;

export const TaskItemChecklistCreateManyAndReturnZodSchema = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), data: z.union([ TaskItemChecklistCreateManyInputObjectSchema, z.array(TaskItemChecklistCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();