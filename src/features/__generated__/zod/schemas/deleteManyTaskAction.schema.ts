import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './objects/TaskActionWhereInput.schema';

export const TaskActionDeleteManySchema: z.ZodType<Prisma.TaskActionDeleteManyArgs> = z.object({ where: TaskActionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskActionDeleteManyArgs>;

export const TaskActionDeleteManyZodSchema = z.object({ where: TaskActionWhereInputObjectSchema.optional() }).strict();