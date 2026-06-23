import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './objects/TaskItemSelect.schema';
import { TaskItemIncludeObjectSchema as TaskItemIncludeObjectSchema } from './objects/TaskItemInclude.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './objects/TaskItemWhereUniqueInput.schema';
import { TaskItemCreateInputObjectSchema as TaskItemCreateInputObjectSchema } from './objects/TaskItemCreateInput.schema';
import { TaskItemUncheckedCreateInputObjectSchema as TaskItemUncheckedCreateInputObjectSchema } from './objects/TaskItemUncheckedCreateInput.schema';
import { TaskItemUpdateInputObjectSchema as TaskItemUpdateInputObjectSchema } from './objects/TaskItemUpdateInput.schema';
import { TaskItemUncheckedUpdateInputObjectSchema as TaskItemUncheckedUpdateInputObjectSchema } from './objects/TaskItemUncheckedUpdateInput.schema';

export const TaskItemUpsertOneSchema: z.ZodType<Prisma.TaskItemUpsertArgs> = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), where: TaskItemWhereUniqueInputObjectSchema, create: z.union([ TaskItemCreateInputObjectSchema, TaskItemUncheckedCreateInputObjectSchema ]), update: z.union([ TaskItemUpdateInputObjectSchema, TaskItemUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskItemUpsertArgs>;

export const TaskItemUpsertOneZodSchema = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), where: TaskItemWhereUniqueInputObjectSchema, create: z.union([ TaskItemCreateInputObjectSchema, TaskItemUncheckedCreateInputObjectSchema ]), update: z.union([ TaskItemUpdateInputObjectSchema, TaskItemUncheckedUpdateInputObjectSchema ]) }).strict();