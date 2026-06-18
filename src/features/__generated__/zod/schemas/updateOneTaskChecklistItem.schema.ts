import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemSelectObjectSchema as TaskChecklistItemSelectObjectSchema } from './objects/TaskChecklistItemSelect.schema';
import { TaskChecklistItemIncludeObjectSchema as TaskChecklistItemIncludeObjectSchema } from './objects/TaskChecklistItemInclude.schema';
import { TaskChecklistItemUpdateInputObjectSchema as TaskChecklistItemUpdateInputObjectSchema } from './objects/TaskChecklistItemUpdateInput.schema';
import { TaskChecklistItemUncheckedUpdateInputObjectSchema as TaskChecklistItemUncheckedUpdateInputObjectSchema } from './objects/TaskChecklistItemUncheckedUpdateInput.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './objects/TaskChecklistItemWhereUniqueInput.schema';

export const TaskChecklistItemUpdateOneSchema: z.ZodType<Prisma.TaskChecklistItemUpdateArgs> = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), data: z.union([TaskChecklistItemUpdateInputObjectSchema, TaskChecklistItemUncheckedUpdateInputObjectSchema]), where: TaskChecklistItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateArgs>;

export const TaskChecklistItemUpdateOneZodSchema = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), data: z.union([TaskChecklistItemUpdateInputObjectSchema, TaskChecklistItemUncheckedUpdateInputObjectSchema]), where: TaskChecklistItemWhereUniqueInputObjectSchema }).strict();