import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './objects/TaskItemSelect.schema';
import { TaskItemIncludeObjectSchema as TaskItemIncludeObjectSchema } from './objects/TaskItemInclude.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './objects/TaskItemWhereUniqueInput.schema';

export const TaskItemFindUniqueSchema: z.ZodType<Prisma.TaskItemFindUniqueArgs> = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), where: TaskItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemFindUniqueArgs>;

export const TaskItemFindUniqueZodSchema = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), where: TaskItemWhereUniqueInputObjectSchema }).strict();