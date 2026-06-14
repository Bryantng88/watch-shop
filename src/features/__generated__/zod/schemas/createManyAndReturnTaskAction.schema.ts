import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionSelectObjectSchema as TaskActionSelectObjectSchema } from './objects/TaskActionSelect.schema';
import { TaskActionCreateManyInputObjectSchema as TaskActionCreateManyInputObjectSchema } from './objects/TaskActionCreateManyInput.schema';

export const TaskActionCreateManyAndReturnSchema: z.ZodType<Prisma.TaskActionCreateManyAndReturnArgs> = z.object({ select: TaskActionSelectObjectSchema.optional(), data: z.union([ TaskActionCreateManyInputObjectSchema, z.array(TaskActionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskActionCreateManyAndReturnArgs>;

export const TaskActionCreateManyAndReturnZodSchema = z.object({ select: TaskActionSelectObjectSchema.optional(), data: z.union([ TaskActionCreateManyInputObjectSchema, z.array(TaskActionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();