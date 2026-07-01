import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityScalarWhereInputObjectSchema as TaskItemActivityScalarWhereInputObjectSchema } from './TaskItemActivityScalarWhereInput.schema';
import { TaskItemActivityUpdateManyMutationInputObjectSchema as TaskItemActivityUpdateManyMutationInputObjectSchema } from './TaskItemActivityUpdateManyMutationInput.schema';
import { TaskItemActivityUncheckedUpdateManyWithoutTaskItemInputObjectSchema as TaskItemActivityUncheckedUpdateManyWithoutTaskItemInputObjectSchema } from './TaskItemActivityUncheckedUpdateManyWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemActivityUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateManyWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskItemActivityUpdateManyWithWhereWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpdateManyWithWhereWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateManyWithWhereWithoutTaskItemInput>;
export const TaskItemActivityUpdateManyWithWhereWithoutTaskItemInputObjectZodSchema = makeSchema();
