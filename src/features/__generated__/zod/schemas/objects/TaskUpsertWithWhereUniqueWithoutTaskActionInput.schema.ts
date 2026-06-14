import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutTaskActionInputObjectSchema as TaskUpdateWithoutTaskActionInputObjectSchema } from './TaskUpdateWithoutTaskActionInput.schema';
import { TaskUncheckedUpdateWithoutTaskActionInputObjectSchema as TaskUncheckedUpdateWithoutTaskActionInputObjectSchema } from './TaskUncheckedUpdateWithoutTaskActionInput.schema';
import { TaskCreateWithoutTaskActionInputObjectSchema as TaskCreateWithoutTaskActionInputObjectSchema } from './TaskCreateWithoutTaskActionInput.schema';
import { TaskUncheckedCreateWithoutTaskActionInputObjectSchema as TaskUncheckedCreateWithoutTaskActionInputObjectSchema } from './TaskUncheckedCreateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTaskActionInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskActionInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutTaskActionInput>;
export const TaskUpsertWithWhereUniqueWithoutTaskActionInputObjectZodSchema = makeSchema();
