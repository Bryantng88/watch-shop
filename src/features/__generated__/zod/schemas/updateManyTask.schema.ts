import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './objects/TaskUpdateManyMutationInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';

export const TaskUpdateManySchema: z.ZodType<Prisma.TaskUpdateManyArgs> = z.object({ data: TaskUpdateManyMutationInputObjectSchema, where: TaskWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskUpdateManyArgs>;

export const TaskUpdateManyZodSchema = z.object({ data: TaskUpdateManyMutationInputObjectSchema, where: TaskWhereInputObjectSchema.optional() }).strict();