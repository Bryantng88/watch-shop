import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutAssignedToUserInputObjectSchema as TaskCreateWithoutAssignedToUserInputObjectSchema } from './TaskCreateWithoutAssignedToUserInput.schema';
import { TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedCreateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutAssignedToUserInput>;
export const TaskCreateOrConnectWithoutAssignedToUserInputObjectZodSchema = makeSchema();
