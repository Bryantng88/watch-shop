import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './objects/TaskItemSelect.schema';
import { TaskItemIncludeObjectSchema as TaskItemIncludeObjectSchema } from './objects/TaskItemInclude.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './objects/TaskItemWhereUniqueInput.schema';

export const TaskItemDeleteOneSchema: z.ZodType<Prisma.TaskItemDeleteArgs> = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), where: TaskItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskItemDeleteArgs>;

export const TaskItemDeleteOneZodSchema = z.object({ select: TaskItemSelectObjectSchema.optional(), include: TaskItemIncludeObjectSchema.optional(), where: TaskItemWhereUniqueInputObjectSchema }).strict();