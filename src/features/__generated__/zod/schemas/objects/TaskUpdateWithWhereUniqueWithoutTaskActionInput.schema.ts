import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutTaskActionInputObjectSchema as TaskUpdateWithoutTaskActionInputObjectSchema } from './TaskUpdateWithoutTaskActionInput.schema';
import { TaskUncheckedUpdateWithoutTaskActionInputObjectSchema as TaskUncheckedUpdateWithoutTaskActionInputObjectSchema } from './TaskUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTaskActionInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutTaskActionInput>;
export const TaskUpdateWithWhereUniqueWithoutTaskActionInputObjectZodSchema = makeSchema();
