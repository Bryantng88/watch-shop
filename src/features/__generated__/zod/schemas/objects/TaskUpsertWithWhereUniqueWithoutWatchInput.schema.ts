import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutWatchInputObjectSchema as TaskUpdateWithoutWatchInputObjectSchema } from './TaskUpdateWithoutWatchInput.schema';
import { TaskUncheckedUpdateWithoutWatchInputObjectSchema as TaskUncheckedUpdateWithoutWatchInputObjectSchema } from './TaskUncheckedUpdateWithoutWatchInput.schema';
import { TaskCreateWithoutWatchInputObjectSchema as TaskCreateWithoutWatchInputObjectSchema } from './TaskCreateWithoutWatchInput.schema';
import { TaskUncheckedCreateWithoutWatchInputObjectSchema as TaskUncheckedCreateWithoutWatchInputObjectSchema } from './TaskUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutWatchInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutWatchInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutWatchInput>;
export const TaskUpsertWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
