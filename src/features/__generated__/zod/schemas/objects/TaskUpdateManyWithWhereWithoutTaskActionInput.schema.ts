import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutTaskActionInputObjectSchema as TaskUncheckedUpdateManyWithoutTaskActionInputObjectSchema } from './TaskUncheckedUpdateManyWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutTaskActionInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutTaskActionInput>;
export const TaskUpdateManyWithWhereWithoutTaskActionInputObjectZodSchema = makeSchema();
