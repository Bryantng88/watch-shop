import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemCreateManyInputObjectSchema as TaskChecklistItemCreateManyInputObjectSchema } from './objects/TaskChecklistItemCreateManyInput.schema';

export const TaskChecklistItemCreateManySchema: z.ZodType<Prisma.TaskChecklistItemCreateManyArgs> = z.object({ data: z.union([ TaskChecklistItemCreateManyInputObjectSchema, z.array(TaskChecklistItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateManyArgs>;

export const TaskChecklistItemCreateManyZodSchema = z.object({ data: z.union([ TaskChecklistItemCreateManyInputObjectSchema, z.array(TaskChecklistItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();