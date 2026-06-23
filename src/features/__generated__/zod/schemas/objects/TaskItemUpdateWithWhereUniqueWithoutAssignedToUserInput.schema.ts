import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithoutAssignedToUserInputObjectSchema as TaskItemUpdateWithoutAssignedToUserInputObjectSchema } from './TaskItemUpdateWithoutAssignedToUserInput.schema';
import { TaskItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema as TaskItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema } from './TaskItemUncheckedUpdateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemUpdateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInput>;
export const TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectZodSchema = makeSchema();
