import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistUpdateWithoutTaskItemInputObjectSchema as TaskItemChecklistUpdateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUpdateWithoutTaskItemInput.schema';
import { TaskItemChecklistUncheckedUpdateWithoutTaskItemInputObjectSchema as TaskItemChecklistUncheckedUpdateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUncheckedUpdateWithoutTaskItemInput.schema';
import { TaskItemChecklistCreateWithoutTaskItemInputObjectSchema as TaskItemChecklistCreateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistCreateWithoutTaskItemInput.schema';
import { TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema as TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUncheckedCreateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemChecklistUpdateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedUpdateWithoutTaskItemInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemChecklistCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInput>;
export const TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInputObjectZodSchema = makeSchema();
