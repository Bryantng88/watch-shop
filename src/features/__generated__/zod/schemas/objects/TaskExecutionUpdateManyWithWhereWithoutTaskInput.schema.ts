import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema';
import { TaskExecutionUpdateManyMutationInputObjectSchema as TaskExecutionUpdateManyMutationInputObjectSchema } from './TaskExecutionUpdateManyMutationInput.schema';
import { TaskExecutionUncheckedUpdateManyWithoutTaskInputObjectSchema as TaskExecutionUncheckedUpdateManyWithoutTaskInputObjectSchema } from './TaskExecutionUncheckedUpdateManyWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateManyWithoutTaskInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateManyWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutTaskInput>;
export const TaskExecutionUpdateManyWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
