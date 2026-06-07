import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema as TaskUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedUpdateManyWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutAssignedToUserInput>;
export const TaskUpdateManyWithWhereWithoutAssignedToUserInputObjectZodSchema = makeSchema();
