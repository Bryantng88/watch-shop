import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistWhereInputObjectSchema as TaskItemChecklistWhereInputObjectSchema } from './objects/TaskItemChecklistWhereInput.schema';

export const TaskItemChecklistDeleteManySchema: z.ZodType<Prisma.TaskItemChecklistDeleteManyArgs> = z.object({ where: TaskItemChecklistWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistDeleteManyArgs>;

export const TaskItemChecklistDeleteManyZodSchema = z.object({ where: TaskItemChecklistWhereInputObjectSchema.optional() }).strict();