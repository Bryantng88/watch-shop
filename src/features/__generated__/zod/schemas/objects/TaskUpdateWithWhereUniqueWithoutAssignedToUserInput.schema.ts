import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutAssignedToUserInputObjectSchema as TaskUpdateWithoutAssignedToUserInputObjectSchema } from './TaskUpdateWithoutAssignedToUserInput.schema';
import { TaskUncheckedUpdateWithoutAssignedToUserInputObjectSchema as TaskUncheckedUpdateWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedUpdateWithoutAssignedToUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutAssignedToUserInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutAssignedToUserInput>;
export const TaskUpdateWithWhereUniqueWithoutAssignedToUserInputObjectZodSchema = makeSchema();
