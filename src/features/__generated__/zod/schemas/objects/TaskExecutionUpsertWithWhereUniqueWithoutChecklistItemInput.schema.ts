import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutChecklistItemInputObjectSchema as TaskExecutionUpdateWithoutChecklistItemInputObjectSchema } from './TaskExecutionUpdateWithoutChecklistItemInput.schema';
import { TaskExecutionUncheckedUpdateWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedUpdateWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutChecklistItemInput.schema';
import { TaskExecutionCreateWithoutChecklistItemInputObjectSchema as TaskExecutionCreateWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateWithoutChecklistItemInput.schema';
import { TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutChecklistItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutChecklistItemInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema)])
}).strict();
export const TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInput>;
export const TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInputObjectZodSchema = makeSchema();
