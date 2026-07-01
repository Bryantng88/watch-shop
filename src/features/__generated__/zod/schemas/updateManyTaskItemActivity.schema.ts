import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivityUpdateManyMutationInputObjectSchema as TaskItemActivityUpdateManyMutationInputObjectSchema } from './objects/TaskItemActivityUpdateManyMutationInput.schema';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './objects/TaskItemActivityWhereInput.schema';

export const TaskItemActivityUpdateManySchema: z.ZodType<Prisma.TaskItemActivityUpdateManyArgs> = z.object({ data: TaskItemActivityUpdateManyMutationInputObjectSchema, where: TaskItemActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateManyArgs>;

export const TaskItemActivityUpdateManyZodSchema = z.object({ data: TaskItemActivityUpdateManyMutationInputObjectSchema, where: TaskItemActivityWhereInputObjectSchema.optional() }).strict();