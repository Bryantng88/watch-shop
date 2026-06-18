import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithoutTaskInputObjectSchema as TaskChecklistItemUpdateWithoutTaskInputObjectSchema } from './TaskChecklistItemUpdateWithoutTaskInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutTaskInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutTaskInput.schema';
import { TaskChecklistItemCreateWithoutTaskInputObjectSchema as TaskChecklistItemCreateWithoutTaskInputObjectSchema } from './TaskChecklistItemCreateWithoutTaskInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskChecklistItemUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInput>;
export const TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
