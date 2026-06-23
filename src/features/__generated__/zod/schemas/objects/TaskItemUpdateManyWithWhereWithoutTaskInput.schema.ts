import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemScalarWhereInputObjectSchema as TaskItemScalarWhereInputObjectSchema } from './TaskItemScalarWhereInput.schema';
import { TaskItemUpdateManyMutationInputObjectSchema as TaskItemUpdateManyMutationInputObjectSchema } from './TaskItemUpdateManyMutationInput.schema';
import { TaskItemUncheckedUpdateManyWithoutTaskInputObjectSchema as TaskItemUncheckedUpdateManyWithoutTaskInputObjectSchema } from './TaskItemUncheckedUpdateManyWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateManyWithoutTaskInputObjectSchema)])
}).strict();
export const TaskItemUpdateManyWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateManyWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateManyWithWhereWithoutTaskInput>;
export const TaskItemUpdateManyWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
