import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutTaskTypeInputObjectSchema as TaskUncheckedUpdateManyWithoutTaskTypeInputObjectSchema } from './TaskUncheckedUpdateManyWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutTaskTypeInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutTaskTypeInput>;
export const TaskUpdateManyWithWhereWithoutTaskTypeInputObjectZodSchema = makeSchema();
