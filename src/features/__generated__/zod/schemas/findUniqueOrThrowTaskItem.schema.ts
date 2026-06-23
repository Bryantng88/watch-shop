import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './objects/TaskItemSelect.schema';
import { TaskItemIncludeObjectSchema as TaskItemIncludeObjectSchema } from './objects/TaskItemInclude.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './objects/TaskItemWhereUniqueInput.schema';

export const TaskItemFindUniqueOrThrowSchema: z.ZodType<Prisma.TaskItemFindUniqueOrThrowArgs> = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), where: TaskItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemFindUniqueOrThrowArgs>;

export const TaskItemFindUniqueOrThrowZodSchema = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), where: TaskItemWhereUniqueInputObjectSchema }).strict();