import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutCreatedByUserInputObjectSchema as TaskUpdateWithoutCreatedByUserInputObjectSchema } from './TaskUpdateWithoutCreatedByUserInput.schema';
import { TaskUncheckedUpdateWithoutCreatedByUserInputObjectSchema as TaskUncheckedUpdateWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedUpdateWithoutCreatedByUserInput.schema';
import { TaskCreateWithoutCreatedByUserInputObjectSchema as TaskCreateWithoutCreatedByUserInputObjectSchema } from './TaskCreateWithoutCreatedByUserInput.schema';
import { TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema as TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCreatedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutCreatedByUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutCreatedByUserInput>;
export const TaskUpsertWithWhereUniqueWithoutCreatedByUserInputObjectZodSchema = makeSchema();
