import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithoutTaskInputObjectSchema as TaskItemUpdateWithoutTaskInputObjectSchema } from './TaskItemUpdateWithoutTaskInput.schema';
import { TaskItemUncheckedUpdateWithoutTaskInputObjectSchema as TaskItemUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskItemUncheckedUpdateWithoutTaskInput.schema';
import { TaskItemCreateWithoutTaskInputObjectSchema as TaskItemCreateWithoutTaskInputObjectSchema } from './TaskItemCreateWithoutTaskInput.schema';
import { TaskItemUncheckedCreateWithoutTaskInputObjectSchema as TaskItemUncheckedCreateWithoutTaskInputObjectSchema } from './TaskItemUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemUpsertWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpsertWithWhereUniqueWithoutTaskInput>;
export const TaskItemUpsertWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
