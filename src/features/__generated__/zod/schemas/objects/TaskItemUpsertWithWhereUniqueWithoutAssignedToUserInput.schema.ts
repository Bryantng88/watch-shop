import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithoutAssignedToUserInputObjectSchema as TaskItemUpdateWithoutAssignedToUserInputObjectSchema } from './TaskItemUpdateWithoutAssignedToUserInput.schema';
import { TaskItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema as TaskItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema } from './TaskItemUncheckedUpdateWithoutAssignedToUserInput.schema';
import { TaskItemCreateWithoutAssignedToUserInputObjectSchema as TaskItemCreateWithoutAssignedToUserInputObjectSchema } from './TaskItemCreateWithoutAssignedToUserInput.schema';
import { TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskItemUncheckedCreateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemUpdateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInput>;
export const TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectZodSchema = makeSchema();
