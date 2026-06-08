import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutTaskTypeInputObjectSchema as TaskUpdateWithoutTaskTypeInputObjectSchema } from './TaskUpdateWithoutTaskTypeInput.schema';
import { TaskUncheckedUpdateWithoutTaskTypeInputObjectSchema as TaskUncheckedUpdateWithoutTaskTypeInputObjectSchema } from './TaskUncheckedUpdateWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTaskTypeInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutTaskTypeInput>;
export const TaskUpdateWithWhereUniqueWithoutTaskTypeInputObjectZodSchema = makeSchema();
