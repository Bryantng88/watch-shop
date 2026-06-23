import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemChecklistSelectObjectSchema as TaskItemChecklistSelectObjectSchema } from './objects/TaskItemChecklistSelect.schema';
import { TaskItemChecklistIncludeObjectSchema as TaskItemChecklistIncludeObjectSchema } from './objects/TaskItemChecklistInclude.schema';
import { TaskItemChecklistCreateInputObjectSchema as TaskItemChecklistCreateInputObjectSchema } from './objects/TaskItemChecklistCreateInput.schema';
import { TaskItemChecklistUncheckedCreateInputObjectSchema as TaskItemChecklistUncheckedCreateInputObjectSchema } from './objects/TaskItemChecklistUncheckedCreateInput.schema';

export const TaskItemChecklistCreateOneSchema: z.ZodType<Prisma.TaskItemChecklistCreateArgs> = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), data: z.union([TaskItemChecklistCreateInputObjectSchema, TaskItemChecklistUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateArgs>;

export const TaskItemChecklistCreateOneZodSchema = z.object({ select: TaskItemChecklistSelectObjectSchema.optional(), include: TaskItemChecklistIncludeObjectSchema.optional(), data: z.union([TaskItemChecklistCreateInputObjectSchema, TaskItemChecklistUncheckedCreateInputObjectSchema]) }).strict();