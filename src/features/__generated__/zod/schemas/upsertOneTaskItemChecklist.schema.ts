import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistSelectObjectSchema as TaskItemChecklistSelectObjectSchema } from './objects/TaskItemChecklistSelect.schema';
import { TaskItemChecklistIncludeObjectSchema as TaskItemChecklistIncludeObjectSchema } from './objects/TaskItemChecklistInclude.schema';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './objects/TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistCreateInputObjectSchema as TaskItemChecklistCreateInputObjectSchema } from './objects/TaskItemChecklistCreateInput.schema';
import { TaskItemChecklistUncheckedCreateInputObjectSchema as TaskItemChecklistUncheckedCreateInputObjectSchema } from './objects/TaskItemChecklistUncheckedCreateInput.schema';
import { TaskItemChecklistUpdateInputObjectSchema as TaskItemChecklistUpdateInputObjectSchema } from './objects/TaskItemChecklistUpdateInput.schema';
import { TaskItemChecklistUncheckedUpdateInputObjectSchema as TaskItemChecklistUncheckedUpdateInputObjectSchema } from './objects/TaskItemChecklistUncheckedUpdateInput.schema';

export const TaskItemChecklistUpsertOneSchema: z.ZodType<Prisma.TaskItemChecklistUpsertArgs> = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), where: TaskItemChecklistWhereUniqueInputObjectSchema, create: z.union([ TaskItemChecklistCreateInputObjectSchema, TaskItemChecklistUncheckedCreateInputObjectSchema ]), update: z.union([ TaskItemChecklistUpdateInputObjectSchema, TaskItemChecklistUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistUpsertArgs>;

export const TaskItemChecklistUpsertOneZodSchema = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), where: TaskItemChecklistWhereUniqueInputObjectSchema, create: z.union([ TaskItemChecklistCreateInputObjectSchema, TaskItemChecklistUncheckedCreateInputObjectSchema ]), update: z.union([ TaskItemChecklistUpdateInputObjectSchema, TaskItemChecklistUncheckedUpdateInputObjectSchema ]) }).strict();