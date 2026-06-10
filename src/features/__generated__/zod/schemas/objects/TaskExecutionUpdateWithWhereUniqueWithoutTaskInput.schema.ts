import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutTaskInputObjectSchema as TaskExecutionUpdateWithoutTaskInputObjectSchema } from './TaskExecutionUpdateWithoutTaskInput.schema';
import { TaskExecutionUncheckedUpdateWithoutTaskInputObjectSchema as TaskExecutionUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutTaskInput>;
export const TaskExecutionUpdateWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
