import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './objects/TaskChecklistItemWhereInput.schema';

export const TaskChecklistItemDeleteManySchema: z.ZodType<Prisma.TaskChecklistItemDeleteManyArgs> = z.object({ where: TaskChecklistItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemDeleteManyArgs>;

export const TaskChecklistItemDeleteManyZodSchema = z.object({ where: TaskChecklistItemWhereInputObjectSchema.optional() }).strict();