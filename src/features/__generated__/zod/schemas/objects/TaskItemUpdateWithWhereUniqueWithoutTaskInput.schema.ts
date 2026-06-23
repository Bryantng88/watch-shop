import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithoutTaskInputObjectSchema as TaskItemUpdateWithoutTaskInputObjectSchema } from './TaskItemUpdateWithoutTaskInput.schema';
import { TaskItemUncheckedUpdateWithoutTaskInputObjectSchema as TaskItemUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskItemUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateWithWhereUniqueWithoutTaskInput>;
export const TaskItemUpdateWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
