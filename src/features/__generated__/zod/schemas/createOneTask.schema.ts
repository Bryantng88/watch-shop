import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskSelectObjectSchema as TaskSelectObjectSchema } from './objects/TaskSelect.schema';
import { TaskIncludeObjectSchema as TaskIncludeObjectSchema } from './objects/TaskInclude.schema';
import { TaskCreateInputObjectSchema as TaskCreateInputObjectSchema } from './objects/TaskCreateInput.schema';
import { TaskUncheckedCreateInputObjectSchema as TaskUncheckedCreateInputObjectSchema } from './objects/TaskUncheckedCreateInput.schema';

export const TaskCreateOneSchema: z.ZodType<Prisma.TaskCreateArgs> = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), data: z.union([TaskCreateInputObjectSchema, TaskUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskCreateArgs>;

export const TaskCreateOneZodSchema = z.object({ select: TaskSelectObjectSchema.optional(), include: TaskIncludeObjectSchema.optional(), data: z.union([TaskCreateInputObjectSchema, TaskUncheckedCreateInputObjectSchema]) }).strict();