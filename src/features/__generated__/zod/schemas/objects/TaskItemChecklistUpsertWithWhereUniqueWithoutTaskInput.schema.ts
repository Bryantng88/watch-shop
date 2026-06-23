import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistUpdateWithoutTaskInputObjectSchema as TaskItemChecklistUpdateWithoutTaskInputObjectSchema } from './TaskItemChecklistUpdateWithoutTaskInput.schema';
import { TaskItemChecklistUncheckedUpdateWithoutTaskInputObjectSchema as TaskItemChecklistUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskItemChecklistUncheckedUpdateWithoutTaskInput.schema';
import { TaskItemChecklistCreateWithoutTaskInputObjectSchema as TaskItemChecklistCreateWithoutTaskInputObjectSchema } from './TaskItemChecklistCreateWithoutTaskInput.schema';
import { TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema as TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema } from './TaskItemChecklistUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemChecklistUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemChecklistCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInput>;
export const TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
