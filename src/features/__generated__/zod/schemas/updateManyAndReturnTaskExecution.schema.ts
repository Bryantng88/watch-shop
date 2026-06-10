import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionSelectObjectSchema as TaskExecutionSelectObjectSchema } from './objects/TaskExecutionSelect.schema';
import { TaskExecutionUpdateManyMutationInputObjectSchema as TaskExecutionUpdateManyMutationInputObjectSchema } from './objects/TaskExecutionUpdateManyMutationInput.schema';
import { TaskExecutionWhereInputObjectSchema as TaskExecutionWhereInputObjectSchema } from './objects/TaskExecutionWhereInput.schema';

export const TaskExecutionUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskExecutionUpdateManyAndReturnArgs> = z.object({ select: TaskExecutionSelectObjectSchema.optional(), data: TaskExecutionUpdateManyMutationInputObjectSchema, where: TaskExecutionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyAndReturnArgs>;

export const TaskExecutionUpdateManyAndReturnZodSchema = z.object({ select: TaskExecutionSelectObjectSchema.optional(), data: TaskExecutionUpdateManyMutationInputObjectSchema, where: TaskExecutionWhereInputObjectSchema.optional() }).strict();