import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemScalarWhereInputObjectSchema as TaskChecklistItemScalarWhereInputObjectSchema } from './TaskChecklistItemScalarWhereInput.schema';
import { TaskChecklistItemUpdateManyMutationInputObjectSchema as TaskChecklistItemUpdateManyMutationInputObjectSchema } from './TaskChecklistItemUpdateManyMutationInput.schema';
import { TaskChecklistItemUncheckedUpdateManyWithoutUserInputObjectSchema as TaskChecklistItemUncheckedUpdateManyWithoutUserInputObjectSchema } from './TaskChecklistItemUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskChecklistItemUpdateManyMutationInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateManyWithWhereWithoutUserInput>;
export const TaskChecklistItemUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
