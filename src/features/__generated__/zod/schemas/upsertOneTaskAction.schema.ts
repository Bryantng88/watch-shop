import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionSelectObjectSchema as TaskActionSelectObjectSchema } from './objects/TaskActionSelect.schema';
import { TaskActionIncludeObjectSchema as TaskActionIncludeObjectSchema } from './objects/TaskActionInclude.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './objects/TaskActionWhereUniqueInput.schema';
import { TaskActionCreateInputObjectSchema as TaskActionCreateInputObjectSchema } from './objects/TaskActionCreateInput.schema';
import { TaskActionUncheckedCreateInputObjectSchema as TaskActionUncheckedCreateInputObjectSchema } from './objects/TaskActionUncheckedCreateInput.schema';
import { TaskActionUpdateInputObjectSchema as TaskActionUpdateInputObjectSchema } from './objects/TaskActionUpdateInput.schema';
import { TaskActionUncheckedUpdateInputObjectSchema as TaskActionUncheckedUpdateInputObjectSchema } from './objects/TaskActionUncheckedUpdateInput.schema';

export const TaskActionUpsertOneSchema: z.ZodType<Prisma.TaskActionUpsertArgs> = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), where: TaskActionWhereUniqueInputObjectSchema, create: z.union([ TaskActionCreateInputObjectSchema, TaskActionUncheckedCreateInputObjectSchema ]), update: z.union([ TaskActionUpdateInputObjectSchema, TaskActionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.TaskActionUpsertArgs>;

export const TaskActionUpsertOneZodSchema = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), where: TaskActionWhereUniqueInputObjectSchema, create: z.union([ TaskActionCreateInputObjectSchema, TaskActionUncheckedCreateInputObjectSchema ]), update: z.union([ TaskActionUpdateInputObjectSchema, TaskActionUncheckedUpdateInputObjectSchema ]) }).strict();