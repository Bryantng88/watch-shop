import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionSelectObjectSchema as TaskActionSelectObjectSchema } from './objects/TaskActionSelect.schema';
import { TaskActionIncludeObjectSchema as TaskActionIncludeObjectSchema } from './objects/TaskActionInclude.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './objects/TaskActionWhereUniqueInput.schema';

export const TaskActionFindUniqueOrThrowSchema: z.ZodType<Prisma.TaskActionFindUniqueOrThrowArgs> = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), where: TaskActionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskActionFindUniqueOrThrowArgs>;

export const TaskActionFindUniqueOrThrowZodSchema = z.object({ select: TaskActionSelectObjectSchema.optional(), include: TaskActionIncludeObjectSchema.optional(), where: TaskActionWhereUniqueInputObjectSchema }).strict();