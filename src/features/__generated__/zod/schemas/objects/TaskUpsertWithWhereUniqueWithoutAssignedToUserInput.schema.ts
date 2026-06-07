import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutAssignedToUserInputObjectSchema as TaskUpdateWithoutAssignedToUserInputObjectSchema } from './TaskUpdateWithoutAssignedToUserInput.schema';
import { TaskUncheckedUpdateWithoutAssignedToUserInputObjectSchema as TaskUncheckedUpdateWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedUpdateWithoutAssignedToUserInput.schema';
import { TaskCreateWithoutAssignedToUserInputObjectSchema as TaskCreateWithoutAssignedToUserInputObjectSchema } from './TaskCreateWithoutAssignedToUserInput.schema';
import { TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedCreateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutAssignedToUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutAssignedToUserInput>;
export const TaskUpsertWithWhereUniqueWithoutAssignedToUserInputObjectZodSchema = makeSchema();
