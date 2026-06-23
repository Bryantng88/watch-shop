import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './objects/TaskItemWhereInput.schema';

export const TaskItemDeleteManySchema: z.ZodType<Prisma.TaskItemDeleteManyArgs> = z.object({ where: TaskItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemDeleteManyArgs>;

export const TaskItemDeleteManyZodSchema = z.object({ where: TaskItemWhereInputObjectSchema.optional() }).strict();