import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivitySelectObjectSchema as TaskItemActivitySelectObjectSchema } from './objects/TaskItemActivitySelect.schema';
import { TaskItemActivityUpdateManyMutationInputObjectSchema as TaskItemActivityUpdateManyMutationInputObjectSchema } from './objects/TaskItemActivityUpdateManyMutationInput.schema';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './objects/TaskItemActivityWhereInput.schema';

export const TaskItemActivityUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskItemActivityUpdateManyAndReturnArgs> = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), data: TaskItemActivityUpdateManyMutationInputObjectSchema, where: TaskItemActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateManyAndReturnArgs>;

export const TaskItemActivityUpdateManyAndReturnZodSchema = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), data: TaskItemActivityUpdateManyMutationInputObjectSchema, where: TaskItemActivityWhereInputObjectSchema.optional() }).strict();