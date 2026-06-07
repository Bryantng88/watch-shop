import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskSelectObjectSchema as TaskSelectObjectSchema } from './objects/TaskSelect.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './objects/TaskUpdateManyMutationInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';

export const TaskUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskUpdateManyAndReturnArgs> = z.object({ select: TaskSelectObjectSchema.optional(), data: TaskUpdateManyMutationInputObjectSchema, where: TaskWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskUpdateManyAndReturnArgs>;

export const TaskUpdateManyAndReturnZodSchema = z.object({ select: TaskSelectObjectSchema.optional(), data: TaskUpdateManyMutationInputObjectSchema, where: TaskWhereInputObjectSchema.optional() }).strict();