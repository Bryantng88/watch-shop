import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemSelectObjectSchema as TaskChecklistItemSelectObjectSchema } from './objects/TaskChecklistItemSelect.schema';
import { TaskChecklistItemCreateManyInputObjectSchema as TaskChecklistItemCreateManyInputObjectSchema } from './objects/TaskChecklistItemCreateManyInput.schema';

export const TaskChecklistItemCreateManyAndReturnSchema: z.ZodType<Prisma.TaskChecklistItemCreateManyAndReturnArgs> = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), data: z.union([ TaskChecklistItemCreateManyInputObjectSchema, z.array(TaskChecklistItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateManyAndReturnArgs>;

export const TaskChecklistItemCreateManyAndReturnZodSchema = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), data: z.union([ TaskChecklistItemCreateManyInputObjectSchema, z.array(TaskChecklistItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();