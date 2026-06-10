import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskExecutionSelectObjectSchema as TaskExecutionSelectObjectSchema } from './objects/TaskExecutionSelect.schema';
import { TaskExecutionIncludeObjectSchema as TaskExecutionIncludeObjectSchema } from './objects/TaskExecutionInclude.schema';
import { TaskExecutionCreateInputObjectSchema as TaskExecutionCreateInputObjectSchema } from './objects/TaskExecutionCreateInput.schema';
import { TaskExecutionUncheckedCreateInputObjectSchema as TaskExecutionUncheckedCreateInputObjectSchema } from './objects/TaskExecutionUncheckedCreateInput.schema';

export const TaskExecutionCreateOneSchema: z.ZodType<Prisma.TaskExecutionCreateArgs> = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), data: z.union([TaskExecutionCreateInputObjectSchema, TaskExecutionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskExecutionCreateArgs>;

export const TaskExecutionCreateOneZodSchema = z.object({ select: TaskExecutionSelectObjectSchema.optional(), include: TaskExecutionIncludeObjectSchema.optional(), data: z.union([TaskExecutionCreateInputObjectSchema, TaskExecutionUncheckedCreateInputObjectSchema]) }).strict();