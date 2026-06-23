import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistSelectObjectSchema as TaskItemChecklistSelectObjectSchema } from './objects/TaskItemChecklistSelect.schema';
import { TaskItemChecklistUpdateManyMutationInputObjectSchema as TaskItemChecklistUpdateManyMutationInputObjectSchema } from './objects/TaskItemChecklistUpdateManyMutationInput.schema';
import { TaskItemChecklistWhereInputObjectSchema as TaskItemChecklistWhereInputObjectSchema } from './objects/TaskItemChecklistWhereInput.schema';

export const TaskItemChecklistUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskItemChecklistUpdateManyAndReturnArgs> = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), data: TaskItemChecklistUpdateManyMutationInputObjectSchema, where: TaskItemChecklistWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistUpdateManyAndReturnArgs>;

export const TaskItemChecklistUpdateManyAndReturnZodSchema = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), data: TaskItemChecklistUpdateManyMutationInputObjectSchema, where: TaskItemChecklistWhereInputObjectSchema.optional() }).strict();