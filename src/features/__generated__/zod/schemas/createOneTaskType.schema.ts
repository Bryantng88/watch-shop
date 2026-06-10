import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './objects/TaskTypeSelect.schema';
import { TaskTypeIncludeObjectSchema as TaskTypeIncludeObjectSchema } from './objects/TaskTypeInclude.schema';
import { TaskTypeCreateInputObjectSchema as TaskTypeCreateInputObjectSchema } from './objects/TaskTypeCreateInput.schema';
import { TaskTypeUncheckedCreateInputObjectSchema as TaskTypeUncheckedCreateInputObjectSchema } from './objects/TaskTypeUncheckedCreateInput.schema';

export const TaskTypeCreateOneSchema: z.ZodType<Prisma.TaskTypeCreateArgs> = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), data: z.union([TaskTypeCreateInputObjectSchema, TaskTypeUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskTypeCreateArgs>;

export const TaskTypeCreateOneZodSchema = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), data: z.union([TaskTypeCreateInputObjectSchema, TaskTypeUncheckedCreateInputObjectSchema]) }).strict();