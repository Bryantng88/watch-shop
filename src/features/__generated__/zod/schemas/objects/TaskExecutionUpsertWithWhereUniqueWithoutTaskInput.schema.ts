import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutTaskInputObjectSchema as TaskExecutionUpdateWithoutTaskInputObjectSchema } from './TaskExecutionUpdateWithoutTaskInput.schema';
import { TaskExecutionUncheckedUpdateWithoutTaskInputObjectSchema as TaskExecutionUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutTaskInput.schema';
import { TaskExecutionCreateWithoutTaskInputObjectSchema as TaskExecutionCreateWithoutTaskInputObjectSchema } from './TaskExecutionCreateWithoutTaskInput.schema';
import { TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema as TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskExecutionUpsertWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutTaskInput>;
export const TaskExecutionUpsertWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
