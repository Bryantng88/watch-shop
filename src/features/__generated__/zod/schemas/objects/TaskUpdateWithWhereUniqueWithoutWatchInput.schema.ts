import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutWatchInputObjectSchema as TaskUpdateWithoutWatchInputObjectSchema } from './TaskUpdateWithoutWatchInput.schema';
import { TaskUncheckedUpdateWithoutWatchInputObjectSchema as TaskUncheckedUpdateWithoutWatchInputObjectSchema } from './TaskUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutWatchInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutWatchInput>;
export const TaskUpdateWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
