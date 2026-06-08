import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './objects/TaskTypeSelect.schema';
import { TaskTypeIncludeObjectSchema as TaskTypeIncludeObjectSchema } from './objects/TaskTypeInclude.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './objects/TaskTypeWhereUniqueInput.schema';

export const TaskTypeFindUniqueSchema: z.ZodType<Prisma.TaskTypeFindUniqueArgs> = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), where: TaskTypeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskTypeFindUniqueArgs>;

export const TaskTypeFindUniqueZodSchema = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), where: TaskTypeWhereUniqueInputObjectSchema }).strict();