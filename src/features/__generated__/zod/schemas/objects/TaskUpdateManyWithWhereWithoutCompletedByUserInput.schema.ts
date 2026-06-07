import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutCompletedByUserInputObjectSchema as TaskUncheckedUpdateManyWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCompletedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutCompletedByUserInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutCompletedByUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutCompletedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutCompletedByUserInput>;
export const TaskUpdateManyWithWhereWithoutCompletedByUserInputObjectZodSchema = makeSchema();
