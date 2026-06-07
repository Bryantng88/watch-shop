import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskSelectObjectSchema as TaskSelectObjectSchema } from './objects/TaskSelect.schema';
import { TaskIncludeObjectSchema as TaskIncludeObjectSchema } from './objects/TaskInclude.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';
import { TaskCreateInputObjectSchema as TaskCreateInputObjectSchema } from './objects/TaskCreateInput.schema';
import { TaskUncheckedCreateInputObjectSchema as TaskUncheckedCreateInputObjectSchema } from './objects/TaskUncheckedCreateInput.schema';
import { TaskUpdateInputObjectSchema as TaskUpdateInputObjectSchema } from './objects/TaskUpdateInput.schema';
import { TaskUncheckedUpdateInputObjectSchema as TaskUncheckedUpdateInputObjectSchema } from './objects/TaskUncheckedUpdateInput.schema';

export const TaskUpsertOneSchema: z.ZodType<Prisma.TaskUpsertArgs> = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), where: TaskWhereUniqueInputObjectSchema, create: z.union([ TaskCreateInputObjectSchema, TaskUncheckedCreateInputObjectSchema ]), update: z.union([ TaskUpdateInputObjectSchema, TaskUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskUpsertArgs>;

export const TaskUpsertOneZodSchema = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), where: TaskWhereUniqueInputObjectSchema, create: z.union([ TaskCreateInputObjectSchema, TaskUncheckedCreateInputObjectSchema ]), update: z.union([ TaskUpdateInputObjectSchema, TaskUncheckedUpdateInputObjectSchema ]) }).strict();