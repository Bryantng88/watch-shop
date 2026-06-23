import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './objects/TaskItemSelect.schema';
import { TaskItemIncludeObjectSchema as TaskItemIncludeObjectSchema } from './objects/TaskItemInclude.schema';
import { TaskItemCreateInputObjectSchema as TaskItemCreateInputObjectSchema } from './objects/TaskItemCreateInput.schema';
import { TaskItemUncheckedCreateInputObjectSchema as TaskItemUncheckedCreateInputObjectSchema } from './objects/TaskItemUncheckedCreateInput.schema';

export const TaskItemCreateOneSchema: z.ZodType<Prisma.TaskItemCreateArgs> = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), data: z.union([TaskItemCreateInputObjectSchema, TaskItemUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskItemCreateArgs>;

export const TaskItemCreateOneZodSchema = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), data: z.union([TaskItemCreateInputObjectSchema, TaskItemUncheckedCreateInputObjectSchema]) }).strict();