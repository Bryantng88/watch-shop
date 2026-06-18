import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemSelectObjectSchema as TaskChecklistItemSelectObjectSchema } from './objects/TaskChecklistItemSelect.schema';
import { TaskChecklistItemIncludeObjectSchema as TaskChecklistItemIncludeObjectSchema } from './objects/TaskChecklistItemInclude.schema';
import { TaskChecklistItemCreateInputObjectSchema as TaskChecklistItemCreateInputObjectSchema } from './objects/TaskChecklistItemCreateInput.schema';
import { TaskChecklistItemUncheckedCreateInputObjectSchema as TaskChecklistItemUncheckedCreateInputObjectSchema } from './objects/TaskChecklistItemUncheckedCreateInput.schema';

export const TaskChecklistItemCreateOneSchema: z.ZodType<Prisma.TaskChecklistItemCreateArgs> = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), data: z.union([TaskChecklistItemCreateInputObjectSchema, TaskChecklistItemUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateArgs>;

export const TaskChecklistItemCreateOneZodSchema = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), data: z.union([TaskChecklistItemCreateInputObjectSchema, TaskChecklistItemUncheckedCreateInputObjectSchema]) }).strict();