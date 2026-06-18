import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TaskChecklistItemSelectObjectSchema as TaskChecklistItemSelectObjectSchema } from './objects/TaskChecklistItemSelect.schema';
import { TaskChecklistItemUpdateManyMutationInputObjectSchema as TaskChecklistItemUpdateManyMutationInputObjectSchema } from './objects/TaskChecklistItemUpdateManyMutationInput.schema';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './objects/TaskChecklistItemWhereInput.schema';

export const TaskChecklistItemUpdateManyAndReturnSchema: z.ZodType<Prisma.TaskChecklistItemUpdateManyAndReturnArgs> = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), data: TaskChecklistItemUpdateManyMutationInputObjectSchema, where: TaskChecklistItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateManyAndReturnArgs>;

export const TaskChecklistItemUpdateManyAndReturnZodSchema = z.object({ select: TaskChecklistItemSelectObjectSchema.optional(), data: TaskChecklistItemUpdateManyMutationInputObjectSchema, where: TaskChecklistItemWhereInputObjectSchema.optional() }).strict();