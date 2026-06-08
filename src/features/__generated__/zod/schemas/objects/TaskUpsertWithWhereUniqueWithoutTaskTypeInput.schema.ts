import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutTaskTypeInputObjectSchema as TaskUpdateWithoutTaskTypeInputObjectSchema } from './TaskUpdateWithoutTaskTypeInput.schema';
import { TaskUncheckedUpdateWithoutTaskTypeInputObjectSchema as TaskUncheckedUpdateWithoutTaskTypeInputObjectSchema } from './TaskUncheckedUpdateWithoutTaskTypeInput.schema';
import { TaskCreateWithoutTaskTypeInputObjectSchema as TaskCreateWithoutTaskTypeInputObjectSchema } from './TaskCreateWithoutTaskTypeInput.schema';
import { TaskUncheckedCreateWithoutTaskTypeInputObjectSchema as TaskUncheckedCreateWithoutTaskTypeInputObjectSchema } from './TaskUncheckedCreateWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTaskTypeInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskTypeInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutTaskTypeInput>;
export const TaskUpsertWithWhereUniqueWithoutTaskTypeInputObjectZodSchema = makeSchema();
