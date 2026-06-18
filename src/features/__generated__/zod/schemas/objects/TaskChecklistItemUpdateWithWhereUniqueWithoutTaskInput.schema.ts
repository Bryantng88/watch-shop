import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithoutTaskInputObjectSchema as TaskChecklistItemUpdateWithoutTaskInputObjectSchema } from './TaskChecklistItemUpdateWithoutTaskInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutTaskInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskChecklistItemUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInput>;
export const TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
