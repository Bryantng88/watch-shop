import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutCancelledByUserInputObjectSchema as TaskUncheckedUpdateManyWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCancelledByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutCancelledByUserInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutCancelledByUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutCancelledByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutCancelledByUserInput>;
export const TaskUpdateManyWithWhereWithoutCancelledByUserInputObjectZodSchema = makeSchema();
