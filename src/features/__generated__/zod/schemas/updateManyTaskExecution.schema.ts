import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionUpdateManyMutationInputObjectSchema as TaskExecutionUpdateManyMutationInputObjectSchema } from './objects/TaskExecutionUpdateManyMutationInput.schema';
import { TaskExecutionWhereInputObjectSchema as TaskExecutionWhereInputObjectSchema } from './objects/TaskExecutionWhereInput.schema';

export const TaskExecutionUpdateManySchema: z.ZodType<Prisma.TaskExecutionUpdateManyArgs> = z.object({ data: TaskExecutionUpdateManyMutationInputObjectSchema, where: TaskExecutionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyArgs>;

export const TaskExecutionUpdateManyZodSchema = z.object({ data: TaskExecutionUpdateManyMutationInputObjectSchema, where: TaskExecutionWhereInputObjectSchema.optional() }).strict();