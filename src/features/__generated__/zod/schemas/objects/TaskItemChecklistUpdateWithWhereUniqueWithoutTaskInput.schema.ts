import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistUpdateWithoutTaskInputObjectSchema as TaskItemChecklistUpdateWithoutTaskInputObjectSchema } from './TaskItemChecklistUpdateWithoutTaskInput.schema';
import { TaskItemChecklistUncheckedUpdateWithoutTaskInputObjectSchema as TaskItemChecklistUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskItemChecklistUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemChecklistUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInput>;
export const TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
