import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutCompletedByUserInputObjectSchema as TaskUpdateWithoutCompletedByUserInputObjectSchema } from './TaskUpdateWithoutCompletedByUserInput.schema';
import { TaskUncheckedUpdateWithoutCompletedByUserInputObjectSchema as TaskUncheckedUpdateWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedUpdateWithoutCompletedByUserInput.schema';
import { TaskCreateWithoutCompletedByUserInputObjectSchema as TaskCreateWithoutCompletedByUserInputObjectSchema } from './TaskCreateWithoutCompletedByUserInput.schema';
import { TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema as TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCompletedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutCompletedByUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutCompletedByUserInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutCompletedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutCompletedByUserInput>;
export const TaskUpsertWithWhereUniqueWithoutCompletedByUserInputObjectZodSchema = makeSchema();
