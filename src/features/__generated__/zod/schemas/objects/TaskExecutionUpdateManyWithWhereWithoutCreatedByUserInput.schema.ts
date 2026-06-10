import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema';
import { TaskExecutionUpdateManyMutationInputObjectSchema as TaskExecutionUpdateManyMutationInputObjectSchema } from './TaskExecutionUpdateManyMutationInput.schema';
import { TaskExecutionUncheckedUpdateManyWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedUpdateManyWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedUpdateManyWithoutCreatedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateManyWithoutCreatedByUserInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInput>;
export const TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInputObjectZodSchema = makeSchema();
