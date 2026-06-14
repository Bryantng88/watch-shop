import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionUpdateManyMutationInputObjectSchema as TaskActionUpdateManyMutationInputObjectSchema } from './objects/TaskActionUpdateManyMutationInput.schema';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './objects/TaskActionWhereInput.schema';

export const TaskActionUpdateManySchema: z.ZodType<Prisma.TaskActionUpdateManyArgs> = z.object({ data: TaskActionUpdateManyMutationInputObjectSchema, where: TaskActionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskActionUpdateManyArgs>;

export const TaskActionUpdateManyZodSchema = z.object({ data: TaskActionUpdateManyMutationInputObjectSchema, where: TaskActionWhereInputObjectSchema.optional() }).strict();