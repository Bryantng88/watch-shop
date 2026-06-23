import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistCreateManyInputObjectSchema as TaskItemChecklistCreateManyInputObjectSchema } from './objects/TaskItemChecklistCreateManyInput.schema';

export const TaskItemChecklistCreateManySchema: z.ZodType<Prisma.TaskItemChecklistCreateManyArgs> = z.object({ data: z.union([ TaskItemChecklistCreateManyInputObjectSchema, z.array(TaskItemChecklistCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateManyArgs>;

export const TaskItemChecklistCreateManyZodSchema = z.object({ data: z.union([ TaskItemChecklistCreateManyInputObjectSchema, z.array(TaskItemChecklistCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();