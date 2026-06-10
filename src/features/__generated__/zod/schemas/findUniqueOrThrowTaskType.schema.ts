import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './objects/TaskTypeSelect.schema';
import { TaskTypeIncludeObjectSchema as TaskTypeIncludeObjectSchema } from './objects/TaskTypeInclude.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './objects/TaskTypeWhereUniqueInput.schema';

export const TaskTypeFindUniqueOrThrowSchema: z.ZodType<Prisma.TaskTypeFindUniqueOrThrowArgs> = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), where: TaskTypeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TaskTypeFindUniqueOrThrowArgs>;

export const TaskTypeFindUniqueOrThrowZodSchema = z.object({ select: TaskTypeSelectObjectSchema.optional(), include: TaskTypeIncludeObjectSchema.optional(), where: TaskTypeWhereUniqueInputObjectSchema }).strict();