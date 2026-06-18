import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemSelectObjectSchema as TaskChecklistItemSelectObjectSchema } from './objects/TaskChecklistItemSelect.schema';
import { TaskChecklistItemIncludeObjectSchema as TaskChecklistItemIncludeObjectSchema } from './objects/TaskChecklistItemInclude.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './objects/TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemCreateInputObjectSchema as TaskChecklistItemCreateInputObjectSchema } from './objects/TaskChecklistItemCreateInput.schema';
import { TaskChecklistItemUncheckedCreateInputObjectSchema as TaskChecklistItemUncheckedCreateInputObjectSchema } from './objects/TaskChecklistItemUncheckedCreateInput.schema';
import { TaskChecklistItemUpdateInputObjectSchema as TaskChecklistItemUpdateInputObjectSchema } from './objects/TaskChecklistItemUpdateInput.schema';
import { TaskChecklistItemUncheckedUpdateInputObjectSchema as TaskChecklistItemUncheckedUpdateInputObjectSchema } from './objects/TaskChecklistItemUncheckedUpdateInput.schema';

export const TaskChecklistItemUpsertOneSchema: z.ZodType<Prisma.TaskChecklistItemUpsertArgs> = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), where: TaskChecklistItemWhereUniqueInputObjectSchema, create: z.union([ TaskChecklistItemCreateInputObjectSchema, TaskChecklistItemUncheckedCreateInputObjectSchema ]), update: z.union([ TaskChecklistItemUpdateInputObjectSchema, TaskChecklistItemUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemUpsertArgs>;

export const TaskChecklistItemUpsertOneZodSchema = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), where: TaskChecklistItemWhereUniqueInputObjectSchema, create: z.union([ TaskChecklistItemCreateInputObjectSchema, TaskChecklistItemUncheckedCreateInputObjectSchema ]), update: z.union([ TaskChecklistItemUpdateInputObjectSchema, TaskChecklistItemUncheckedUpdateInputObjectSchema ]) }).strict();