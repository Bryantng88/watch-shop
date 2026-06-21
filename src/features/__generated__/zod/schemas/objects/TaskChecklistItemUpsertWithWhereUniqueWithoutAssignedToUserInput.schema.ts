import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUpdateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUpdateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemCreateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskChecklistItemUpdateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInput>;
export const TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectZodSchema = makeSchema();
