import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema';
import { TaskExecutionUpdateManyMutationInputObjectSchema as TaskExecutionUpdateManyMutationInputObjectSchema } from './TaskExecutionUpdateManyMutationInput.schema';
import { TaskExecutionUncheckedUpdateManyWithoutTaskItemInputObjectSchema as TaskExecutionUncheckedUpdateManyWithoutTaskItemInputObjectSchema } from './TaskExecutionUncheckedUpdateManyWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateManyWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateManyWithWhereWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutTaskItemInput>;
export const TaskExecutionUpdateManyWithWhereWithoutTaskItemInputObjectZodSchema = makeSchema();
