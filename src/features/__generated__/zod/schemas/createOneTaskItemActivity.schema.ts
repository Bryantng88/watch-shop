import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemActivitySelectObjectSchema as TaskItemActivitySelectObjectSchema } from './objects/TaskItemActivitySelect.schema';
import { TaskItemActivityIncludeObjectSchema as TaskItemActivityIncludeObjectSchema } from './objects/TaskItemActivityInclude.schema';
import { TaskItemActivityCreateInputObjectSchema as TaskItemActivityCreateInputObjectSchema } from './objects/TaskItemActivityCreateInput.schema';
import { TaskItemActivityUncheckedCreateInputObjectSchema as TaskItemActivityUncheckedCreateInputObjectSchema } from './objects/TaskItemActivityUncheckedCreateInput.schema';

export const TaskItemActivityCreateOneSchema: z.ZodType<Prisma.TaskItemActivityCreateArgs> = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), data: z.union([TaskItemActivityCreateInputObjectSchema, TaskItemActivityUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskItemActivityCreateArgs>;

export const TaskItemActivityCreateOneZodSchema = z.object({ select: TaskItemActivitySelectObjectSchema.optional(), include: TaskItemActivityIncludeObjectSchema.optional(), data: z.union([TaskItemActivityCreateInputObjectSchema, TaskItemActivityUncheckedCreateInputObjectSchema]) }).strict();