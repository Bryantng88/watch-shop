import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutTaskItemInputObjectSchema as TaskExecutionUpdateWithoutTaskItemInputObjectSchema } from './TaskExecutionUpdateWithoutTaskItemInput.schema';
import { TaskExecutionUncheckedUpdateWithoutTaskItemInputObjectSchema as TaskExecutionUncheckedUpdateWithoutTaskItemInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutTaskItemInput.schema';
import { TaskExecutionCreateWithoutTaskItemInputObjectSchema as TaskExecutionCreateWithoutTaskItemInputObjectSchema } from './TaskExecutionCreateWithoutTaskItemInput.schema';
import { TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema as TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutTaskItemInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInput>;
export const TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInputObjectZodSchema = makeSchema();
