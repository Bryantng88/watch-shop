import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './objects/TaskItemSelect.schema';
import { TaskItemIncludeObjectSchema as TaskItemIncludeObjectSchema } from './objects/TaskItemInclude.schema';
import { TaskItemUpdateInputObjectSchema as TaskItemUpdateInputObjectSchema } from './objects/TaskItemUpdateInput.schema';
import { TaskItemUncheckedUpdateInputObjectSchema as TaskItemUncheckedUpdateInputObjectSchema } from './objects/TaskItemUncheckedUpdateInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './objects/TaskItemWhereUniqueInput.schema';

export const TaskItemUpdateOneSchema: z.ZodType<Prisma.TaskItemUpdateArgs> = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), data: z.union([TaskItemUpdateInputObjectSchema, TaskItemUncheckedUpdateInputObjectSchema]), where: TaskItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemUpdateArgs>;

export const TaskItemUpdateOneZodSchema = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), data: z.union([TaskItemUpdateInputObjectSchema, TaskItemUncheckedUpdateInputObjectSchema]), where: TaskItemWhereUniqueInputObjectSchema }).strict();