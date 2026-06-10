import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './objects/TaskTypeWhereInput.schema';

export const TaskTypeDeleteManySchema: z.ZodType<Prisma.TaskTypeDeleteManyArgs> = z.object({ where: TaskTypeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskTypeDeleteManyArgs>;

export const TaskTypeDeleteManyZodSchema = z.object({ where: TaskTypeWhereInputObjectSchema.optional() }).strict();