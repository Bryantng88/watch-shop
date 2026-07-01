import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './objects/TaskItemActivityWhereInput.schema';

export const TaskItemActivityDeleteManySchema: z.ZodType<Prisma.TaskItemActivityDeleteManyArgs> = z.object({ where: TaskItemActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityDeleteManyArgs>;

export const TaskItemActivityDeleteManyZodSchema = z.object({ where: TaskItemActivityWhereInputObjectSchema.optional() }).strict();