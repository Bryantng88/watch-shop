import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistScalarWhereInputObjectSchema as TaskItemChecklistScalarWhereInputObjectSchema } from './TaskItemChecklistScalarWhereInput.schema';
import { TaskItemChecklistUpdateManyMutationInputObjectSchema as TaskItemChecklistUpdateManyMutationInputObjectSchema } from './TaskItemChecklistUpdateManyMutationInput.schema';
import { TaskItemChecklistUncheckedUpdateManyWithoutTaskInputObjectSchema as TaskItemChecklistUncheckedUpdateManyWithoutTaskInputObjectSchema } from './TaskItemChecklistUncheckedUpdateManyWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemChecklistUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedUpdateManyWithoutTaskInputObjectSchema)])
}).strict();
export const TaskItemChecklistUpdateManyWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUpdateManyWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUpdateManyWithWhereWithoutTaskInput>;
export const TaskItemChecklistUpdateManyWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
