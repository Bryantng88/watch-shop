import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivitySelectObjectSchema as TaskItemActivitySelectObjectSchema } from './objects/TaskItemActivitySelect.schema';
import { TaskItemActivityIncludeObjectSchema as TaskItemActivityIncludeObjectSchema } from './objects/TaskItemActivityInclude.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './objects/TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityCreateInputObjectSchema as TaskItemActivityCreateInputObjectSchema } from './objects/TaskItemActivityCreateInput.schema';
import { TaskItemActivityUncheckedCreateInputObjectSchema as TaskItemActivityUncheckedCreateInputObjectSchema } from './objects/TaskItemActivityUncheckedCreateInput.schema';
import { TaskItemActivityUpdateInputObjectSchema as TaskItemActivityUpdateInputObjectSchema } from './objects/TaskItemActivityUpdateInput.schema';
import { TaskItemActivityUncheckedUpdateInputObjectSchema as TaskItemActivityUncheckedUpdateInputObjectSchema } from './objects/TaskItemActivityUncheckedUpdateInput.schema';

export const TaskItemActivityUpsertOneSchema: z.ZodType<Prisma.TaskItemActivityUpsertArgs> = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), where: TaskItemActivityWhereUniqueInputObjectSchema, create: z.union([ TaskItemActivityCreateInputObjectSchema, TaskItemActivityUncheckedCreateInputObjectSchema ]), update: z.union([ TaskItemActivityUpdateInputObjectSchema, TaskItemActivityUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityUpsertArgs>;

export const TaskItemActivityUpsertOneZodSchema = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), where: TaskItemActivityWhereUniqueInputObjectSchema, create: z.union([ TaskItemActivityCreateInputObjectSchema, TaskItemActivityUncheckedCreateInputObjectSchema ]), update: z.union([ TaskItemActivityUpdateInputObjectSchema, TaskItemActivityUncheckedUpdateInputObjectSchema ]) }).strict();