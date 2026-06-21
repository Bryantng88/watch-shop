import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemCreateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateOrConnectWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateOrConnectWithoutAssignedToUserInput>;
export const TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectZodSchema = makeSchema();
