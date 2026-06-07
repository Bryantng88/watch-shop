import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutWatchInputObjectSchema as TaskUncheckedUpdateManyWithoutWatchInputObjectSchema } from './TaskUncheckedUpdateManyWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutWatchInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutWatchInput>;
export const TaskUpdateManyWithWhereWithoutWatchInputObjectZodSchema = makeSchema();
