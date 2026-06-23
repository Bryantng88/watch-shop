import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemCreateWithoutAssignedToUserInputObjectSchema as TaskItemCreateWithoutAssignedToUserInputObjectSchema } from './TaskItemCreateWithoutAssignedToUserInput.schema';
import { TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskItemUncheckedCreateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskItemCreateOrConnectWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateOrConnectWithoutAssignedToUserInput>;
export const TaskItemCreateOrConnectWithoutAssignedToUserInputObjectZodSchema = makeSchema();
