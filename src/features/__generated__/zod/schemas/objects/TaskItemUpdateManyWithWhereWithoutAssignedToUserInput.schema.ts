import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemScalarWhereInputObjectSchema as TaskItemScalarWhereInputObjectSchema } from './TaskItemScalarWhereInput.schema';
import { TaskItemUpdateManyMutationInputObjectSchema as TaskItemUpdateManyMutationInputObjectSchema } from './TaskItemUpdateManyMutationInput.schema';
import { TaskItemUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema as TaskItemUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema } from './TaskItemUncheckedUpdateManyWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateManyWithWhereWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateManyWithWhereWithoutAssignedToUserInput>;
export const TaskItemUpdateManyWithWhereWithoutAssignedToUserInputObjectZodSchema = makeSchema();
