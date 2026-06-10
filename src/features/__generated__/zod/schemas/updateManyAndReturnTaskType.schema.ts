import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './objects/TaskTypeSelect.schema';
import { TaskTypeUpdateManyMutationInputObjectSchema as TaskTypeUpdateManyMutationInputObjectSchema } from './objects/TaskTypeUpdateManyMutationInput.schema';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './objects/TaskTypeWhereInput.schema';

export const TaskTypeUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskTypeUpdateManyAndReturnArgs> = z.object({ select: TaskTypeSelectObjectSchema.optional(), data: TaskTypeUpdateManyMutationInputObjectSchema, where: TaskTypeWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskTypeUpdateManyAndReturnArgs>;

export const TaskTypeUpdateManyAndReturnZodSchema = z.object({ select: TaskTypeSelectObjectSchema.optional(), data: TaskTypeUpdateManyMutationInputObjectSchema, where: TaskTypeWhereInputObjectSchema.optional() }).strict();