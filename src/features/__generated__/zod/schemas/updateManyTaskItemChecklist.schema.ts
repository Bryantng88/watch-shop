import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistUpdateManyMutationInputObjectSchema as TaskItemChecklistUpdateManyMutationInputObjectSchema } from './objects/TaskItemChecklistUpdateManyMutationInput.schema';
import { TaskItemChecklistWhereInputObjectSchema as TaskItemChecklistWhereInputObjectSchema } from './objects/TaskItemChecklistWhereInput.schema';

export const TaskItemChecklistUpdateManySchema: z.ZodType<Prisma.TaskItemChecklistUpdateManyArgs> = z.object({ data: TaskItemChecklistUpdateManyMutationInputObjectSchema, where: TaskItemChecklistWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistUpdateManyArgs>;

export const TaskItemChecklistUpdateManyZodSchema = z.object({ data: TaskItemChecklistUpdateManyMutationInputObjectSchema, where: TaskItemChecklistWhereInputObjectSchema.optional() }).strict();