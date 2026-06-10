import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionWhereInputObjectSchema as TaskExecutionWhereInputObjectSchema } from './objects/TaskExecutionWhereInput.schema';

export const TaskExecutionDeleteManySchema: z.ZodType<Prisma.TaskExecutionDeleteManyArgs> = z.object({ where: TaskExecutionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskExecutionDeleteManyArgs>;

export const TaskExecutionDeleteManyZodSchema = z.object({ where: TaskExecutionWhereInputObjectSchema.optional() }).strict();