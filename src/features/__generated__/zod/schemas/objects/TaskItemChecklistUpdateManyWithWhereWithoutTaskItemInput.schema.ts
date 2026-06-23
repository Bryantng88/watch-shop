import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistScalarWhereInputObjectSchema as TaskItemChecklistScalarWhereInputObjectSchema } from './TaskItemChecklistScalarWhereInput.schema';
import { TaskItemChecklistUpdateManyMutationInputObjectSchema as TaskItemChecklistUpdateManyMutationInputObjectSchema } from './TaskItemChecklistUpdateManyMutationInput.schema';
import { TaskItemChecklistUncheckedUpdateManyWithoutTaskItemInputObjectSchema as TaskItemChecklistUncheckedUpdateManyWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUncheckedUpdateManyWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemChecklistUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedUpdateManyWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInput>;
export const TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInputObjectZodSchema = makeSchema();
