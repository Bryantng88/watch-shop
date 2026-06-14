import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionCreateManyInputObjectSchema as TaskActionCreateManyInputObjectSchema } from './objects/TaskActionCreateManyInput.schema';

export const TaskActionCreateManySchema: z.ZodType<Prisma.TaskActionCreateManyArgs> = z.object({ data: z.union([ TaskActionCreateManyInputObjectSchema, z.array(TaskActionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TaskActionCreateManyArgs>;

export const TaskActionCreateManyZodSchema = z.object({ data: z.union([ TaskActionCreateManyInputObjectSchema, z.array(TaskActionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();