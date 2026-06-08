import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './objects/TaskTypeSelect.schema';
import { TaskTypeIncludeObjectSchema as TaskTypeIncludeObjectSchema } from './objects/TaskTypeInclude.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './objects/TaskTypeWhereUniqueInput.schema';
import { TaskTypeCreateInputObjectSchema as TaskTypeCreateInputObjectSchema } from './objects/TaskTypeCreateInput.schema';
import { TaskTypeUncheckedCreateInputObjectSchema as TaskTypeUncheckedCreateInputObjectSchema } from './objects/TaskTypeUncheckedCreateInput.schema';
import { TaskTypeUpdateInputObjectSchema as TaskTypeUpdateInputObjectSchema } from './objects/TaskTypeUpdateInput.schema';
import { TaskTypeUncheckedUpdateInputObjectSchema as TaskTypeUncheckedUpdateInputObjectSchema } from './objects/TaskTypeUncheckedUpdateInput.schema';

export const TaskTypeUpsertOneSchema: z.ZodType<Prisma.TaskTypeUpsertArgs> = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), where: TaskTypeWhereUniqueInputObjectSchema, create: z.union([ TaskTypeCreateInputObjectSchema, TaskTypeUncheckedCreateInputObjectSchema ]), update: z.union([ TaskTypeUpdateInputObjectSchema, TaskTypeUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskTypeUpsertArgs>;

export const TaskTypeUpsertOneZodSchema = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), where: TaskTypeWhereUniqueInputObjectSchema, create: z.union([ TaskTypeCreateInputObjectSchema, TaskTypeUncheckedCreateInputObjectSchema ]), update: z.union([ TaskTypeUpdateInputObjectSchema, TaskTypeUncheckedUpdateInputObjectSchema ]) }).strict();