import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './objects/TaskTypeSelect.schema';
import { TaskTypeIncludeObjectSchema as TaskTypeIncludeObjectSchema } from './objects/TaskTypeInclude.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './objects/TaskTypeWhereUniqueInput.schema';

export const TaskTypeDeleteOneSchema: z.ZodType<Prisma.TaskTypeDeleteArgs> = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), where: TaskTypeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskTypeDeleteArgs>;

export const TaskTypeDeleteOneZodSchema = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), where: TaskTypeWhereUniqueInputObjectSchema }).strict();