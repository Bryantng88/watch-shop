import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityUpdateWithoutTaskItemInputObjectSchema as TaskItemActivityUpdateWithoutTaskItemInputObjectSchema } from './TaskItemActivityUpdateWithoutTaskItemInput.schema';
import { TaskItemActivityUncheckedUpdateWithoutTaskItemInputObjectSchema as TaskItemActivityUncheckedUpdateWithoutTaskItemInputObjectSchema } from './TaskItemActivityUncheckedUpdateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemActivityUpdateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInput>;
export const TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInputObjectZodSchema = makeSchema();
