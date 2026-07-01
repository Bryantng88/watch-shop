import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityUpdateWithoutTaskItemInputObjectSchema as TaskItemActivityUpdateWithoutTaskItemInputObjectSchema } from './TaskItemActivityUpdateWithoutTaskItemInput.schema';
import { TaskItemActivityUncheckedUpdateWithoutTaskItemInputObjectSchema as TaskItemActivityUncheckedUpdateWithoutTaskItemInputObjectSchema } from './TaskItemActivityUncheckedUpdateWithoutTaskItemInput.schema';
import { TaskItemActivityCreateWithoutTaskItemInputObjectSchema as TaskItemActivityCreateWithoutTaskItemInputObjectSchema } from './TaskItemActivityCreateWithoutTaskItemInput.schema';
import { TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema as TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemActivityUpdateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateWithoutTaskItemInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInput>;
export const TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInputObjectZodSchema = makeSchema();
