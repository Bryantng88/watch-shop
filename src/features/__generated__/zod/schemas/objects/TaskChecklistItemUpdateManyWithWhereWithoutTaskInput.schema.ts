import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemScalarWhereInputObjectSchema as TaskChecklistItemScalarWhereInputObjectSchema } from './TaskChecklistItemScalarWhereInput.schema';
import { TaskChecklistItemUpdateManyMutationInputObjectSchema as TaskChecklistItemUpdateManyMutationInputObjectSchema } from './TaskChecklistItemUpdateManyMutationInput.schema';
import { TaskChecklistItemUncheckedUpdateManyWithoutTaskInputObjectSchema as TaskChecklistItemUncheckedUpdateManyWithoutTaskInputObjectSchema } from './TaskChecklistItemUncheckedUpdateManyWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskChecklistItemUpdateManyMutationInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateManyWithoutTaskInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpdateManyWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateManyWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateManyWithWhereWithoutTaskInput>;
export const TaskChecklistItemUpdateManyWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
