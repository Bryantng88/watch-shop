import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemUpdateManyMutationInputObjectSchema as TaskChecklistItemUpdateManyMutationInputObjectSchema } from './objects/TaskChecklistItemUpdateManyMutationInput.schema';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './objects/TaskChecklistItemWhereInput.schema';

export const TaskChecklistItemUpdateManySchema: z.ZodType<Prisma.TaskChecklistItemUpdateManyArgs> = z.object({ data: TaskChecklistItemUpdateManyMutationInputObjectSchema, where: TaskChecklistItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateManyArgs>;

export const TaskChecklistItemUpdateManyZodSchema = z.object({ data: TaskChecklistItemUpdateManyMutationInputObjectSchema, where: TaskChecklistItemWhereInputObjectSchema.optional() }).strict();