import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUpdateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUpdateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskChecklistItemUpdateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInput>;
export const TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectZodSchema = makeSchema();
