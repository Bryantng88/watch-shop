import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistUpdateWithoutTaskItemInputObjectSchema as TaskItemChecklistUpdateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUpdateWithoutTaskItemInput.schema';
import { TaskItemChecklistUncheckedUpdateWithoutTaskItemInputObjectSchema as TaskItemChecklistUncheckedUpdateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUncheckedUpdateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemChecklistUpdateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedUpdateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInput>;
export const TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInputObjectZodSchema = makeSchema();
