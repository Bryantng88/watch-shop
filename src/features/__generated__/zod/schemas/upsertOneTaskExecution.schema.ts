import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionSelectObjectSchema as TaskExecutionSelectObjectSchema } from './objects/TaskExecutionSelect.schema';
import { TaskExecutionIncludeObjectSchema as TaskExecutionIncludeObjectSchema } from './objects/TaskExecutionInclude.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './objects/TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionCreateInputObjectSchema as TaskExecutionCreateInputObjectSchema } from './objects/TaskExecutionCreateInput.schema';
import { TaskExecutionUncheckedCreateInputObjectSchema as TaskExecutionUncheckedCreateInputObjectSchema } from './objects/TaskExecutionUncheckedCreateInput.schema';
import { TaskExecutionUpdateInputObjectSchema as TaskExecutionUpdateInputObjectSchema } from './objects/TaskExecutionUpdateInput.schema';
import { TaskExecutionUncheckedUpdateInputObjectSchema as TaskExecutionUncheckedUpdateInputObjectSchema } from './objects/TaskExecutionUncheckedUpdateInput.schema';

export const TaskExecutionUpsertOneSchema: z.ZodType<Prisma.TaskExecutionUpsertArgs> = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), where: TaskExecutionWhereUniqueInputObjectSchema, create: z.union([ TaskExecutionCreateInputObjectSchema, TaskExecutionUncheckedCreateInputObjectSchema ]), update: z.union([ TaskExecutionUpdateInputObjectSchema, TaskExecutionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskExecutionUpsertArgs>;

export const TaskExecutionUpsertOneZodSchema = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), where: TaskExecutionWhereUniqueInputObjectSchema, create: z.union([ TaskExecutionCreateInputObjectSchema, TaskExecutionUncheckedCreateInputObjectSchema ]), update: z.union([ TaskExecutionUpdateInputObjectSchema, TaskExecutionUncheckedUpdateInputObjectSchema ]) }).strict();