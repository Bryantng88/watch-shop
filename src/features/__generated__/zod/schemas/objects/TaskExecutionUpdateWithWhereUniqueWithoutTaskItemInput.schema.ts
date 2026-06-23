import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutTaskItemInputObjectSchema as TaskExecutionUpdateWithoutTaskItemInputObjectSchema } from './TaskExecutionUpdateWithoutTaskItemInput.schema';
import { TaskExecutionUncheckedUpdateWithoutTaskItemInputObjectSchema as TaskExecutionUncheckedUpdateWithoutTaskItemInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInput>;
export const TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInputObjectZodSchema = makeSchema();
