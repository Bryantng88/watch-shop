import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeUpdateManyMutationInputObjectSchema as TaskTypeUpdateManyMutationInputObjectSchema } from './objects/TaskTypeUpdateManyMutationInput.schema';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './objects/TaskTypeWhereInput.schema';

export const TaskTypeUpdateManySchema: z.ZodType<Prisma.TaskTypeUpdateManyArgs> = z.object({ data: TaskTypeUpdateManyMutationInputObjectSchema, where: TaskTypeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskTypeUpdateManyArgs>;

export const TaskTypeUpdateManyZodSchema = z.object({ data: TaskTypeUpdateManyMutationInputObjectSchema, where: TaskTypeWhereInputObjectSchema.optional() }).strict();