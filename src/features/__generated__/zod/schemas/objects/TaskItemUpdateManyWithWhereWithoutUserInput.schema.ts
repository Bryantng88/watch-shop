import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemScalarWhereInputObjectSchema as TaskItemScalarWhereInputObjectSchema } from './TaskItemScalarWhereInput.schema';
import { TaskItemUpdateManyMutationInputObjectSchema as TaskItemUpdateManyMutationInputObjectSchema } from './TaskItemUpdateManyMutationInput.schema';
import { TaskItemUncheckedUpdateManyWithoutUserInputObjectSchema as TaskItemUncheckedUpdateManyWithoutUserInputObjectSchema } from './TaskItemUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const TaskItemUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateManyWithWhereWithoutUserInput>;
export const TaskItemUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
