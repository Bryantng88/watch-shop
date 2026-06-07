import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutCancelledByUserInputObjectSchema as TaskUpdateWithoutCancelledByUserInputObjectSchema } from './TaskUpdateWithoutCancelledByUserInput.schema';
import { TaskUncheckedUpdateWithoutCancelledByUserInputObjectSchema as TaskUncheckedUpdateWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedUpdateWithoutCancelledByUserInput.schema';
import { TaskCreateWithoutCancelledByUserInputObjectSchema as TaskCreateWithoutCancelledByUserInputObjectSchema } from './TaskCreateWithoutCancelledByUserInput.schema';
import { TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema as TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCancelledByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutCancelledByUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutCancelledByUserInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutCancelledByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutCancelledByUserInput>;
export const TaskUpsertWithWhereUniqueWithoutCancelledByUserInputObjectZodSchema = makeSchema();
