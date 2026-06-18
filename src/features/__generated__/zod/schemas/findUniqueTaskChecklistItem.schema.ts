import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemSelectObjectSchema as TaskChecklistItemSelectObjectSchema } from './objects/TaskChecklistItemSelect.schema';
import { TaskChecklistItemIncludeObjectSchema as TaskChecklistItemIncludeObjectSchema } from './objects/TaskChecklistItemInclude.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './objects/TaskChecklistItemWhereUniqueInput.schema';

export const TaskChecklistItemFindUniqueSchema: z.ZodType<Prisma.TaskChecklistItemFindUniqueArgs> = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), where: TaskChecklistItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemFindUniqueArgs>;

export const TaskChecklistItemFindUniqueZodSchema = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), include: TaskChecklistItemIncludeObjectSchema.optional(), where: TaskChecklistItemWhereUniqueInputObjectSchema }).strict();