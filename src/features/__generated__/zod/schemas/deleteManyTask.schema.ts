import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';

export const TaskDeleteManySchema: z.ZodType<Prisma.TaskDeleteManyArgs> = z.object({ where: TaskWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskDeleteManyArgs>;

export const TaskDeleteManyZodSchema = z.object({ where: TaskWhereInputObjectSchema.optional() }).strict();