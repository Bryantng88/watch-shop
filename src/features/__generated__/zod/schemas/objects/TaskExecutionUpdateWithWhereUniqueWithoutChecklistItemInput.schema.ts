import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutChecklistItemInputObjectSchema as TaskExecutionUpdateWithoutChecklistItemInputObjectSchema } from './TaskExecutionUpdateWithoutChecklistItemInput.schema';
import { TaskExecutionUncheckedUpdateWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedUpdateWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutChecklistItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutChecklistItemInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInput>;
export const TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInputObjectZodSchema = makeSchema();
