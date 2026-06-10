import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutCreatedByUserInputObjectSchema as TaskExecutionUpdateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUpdateWithoutCreatedByUserInput.schema';
import { TaskExecutionUncheckedUpdateWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedUpdateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutCreatedByUserInput.schema';
import { TaskExecutionCreateWithoutCreatedByUserInputObjectSchema as TaskExecutionCreateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionCreateWithoutCreatedByUserInput.schema';
import { TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutCreatedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutCreatedByUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema)])
}).strict();
export const TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInput>;
export const TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInputObjectZodSchema = makeSchema();
