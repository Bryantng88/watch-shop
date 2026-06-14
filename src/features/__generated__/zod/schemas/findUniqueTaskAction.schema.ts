import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionSelectObjectSchema as TaskActionSelectObjectSchema } from './objects/TaskActionSelect.schema';
import { TaskActionIncludeObjectSchema as TaskActionIncludeObjectSchema } from './objects/TaskActionInclude.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './objects/TaskActionWhereUniqueInput.schema';

export const TaskActionFindUniqueSchema: z.ZodType<Prisma.TaskActionFindUniqueArgs> = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), where: TaskActionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskActionFindUniqueArgs>;

export const TaskActionFindUniqueZodSchema = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), where: TaskActionWhereUniqueInputObjectSchema }).strict();