import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemUpdateManyMutationInputObjectSchema as TaskItemUpdateManyMutationInputObjectSchema } from './objects/TaskItemUpdateManyMutationInput.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './objects/TaskItemWhereInput.schema';

export const TaskItemUpdateManySchema: z.ZodType<Prisma.TaskItemUpdateManyArgs> = z.object({ data: TaskItemUpdateManyMutationInputObjectSchema, where: TaskItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemUpdateManyArgs>;

export const TaskItemUpdateManyZodSchema = z.object({ data: TaskItemUpdateManyMutationInputObjectSchema, where: TaskItemWhereInputObjectSchema.optional() }).strict();