import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskActionSelectObjectSchema as TaskActionSelectObjectSchema } from './objects/TaskActionSelect.schema';
import { TaskActionUpdateManyMutationInputObjectSchema as TaskActionUpdateManyMutationInputObjectSchema } from './objects/TaskActionUpdateManyMutationInput.schema';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './objects/TaskActionWhereInput.schema';

export const TaskActionUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskActionUpdateManyAndReturnArgs> = z.object({ select: TaskActionSelectObjectSchema.optional(), data: TaskActionUpdateManyMutationInputObjectSchema, where: TaskActionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskActionUpdateManyAndReturnArgs>;

export const TaskActionUpdateManyAndReturnZodSchema = z.object({ select: TaskActionSelectObjectSchema.optional(), data: TaskActionUpdateManyMutationInputObjectSchema, where: TaskActionWhereInputObjectSchema.optional() }).strict();