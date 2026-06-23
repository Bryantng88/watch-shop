import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './objects/TaskItemSelect.schema';
import { TaskItemUpdateManyMutationInputObjectSchema as TaskItemUpdateManyMutationInputObjectSchema } from './objects/TaskItemUpdateManyMutationInput.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './objects/TaskItemWhereInput.schema';

export const TaskItemUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskItemUpdateManyAndReturnArgs> = z.object({ select: TaskItemSelectObjectSchema.optional(), data: TaskItemUpdateManyMutationInputObjectSchema, where: TaskItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskItemUpdateManyAndReturnArgs>;

export const TaskItemUpdateManyAndReturnZodSchema = z.object({ select: TaskItemSelectObjectSchema.optional(), data: TaskItemUpdateManyMutationInputObjectSchema, where: TaskItemWhereInputObjectSchema.optional() }).strict();