import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemScalarWhereInputObjectSchema as TaskChecklistItemScalarWhereInputObjectSchema } from './TaskChecklistItemScalarWhereInput.schema';
import { TaskChecklistItemUpdateManyMutationInputObjectSchema as TaskChecklistItemUpdateManyMutationInputObjectSchema } from './TaskChecklistItemUpdateManyMutationInput.schema';
import { TaskChecklistItemUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUncheckedUpdateManyWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskChecklistItemUpdateManyMutationInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateManyWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInput>;
export const TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInputObjectZodSchema = makeSchema();
