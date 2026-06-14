import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './TaskTypeWhereInput.schema';
import { TaskTypeUpdateWithoutTaskActionInputObjectSchema as TaskTypeUpdateWithoutTaskActionInputObjectSchema } from './TaskTypeUpdateWithoutTaskActionInput.schema';
import { TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema as TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema } from './TaskTypeUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskTypeWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskTypeUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema)])
}).strict();
export const TaskTypeUpdateToOneWithWhereWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskTypeUpdateToOneWithWhereWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUpdateToOneWithWhereWithoutTaskActionInput>;
export const TaskTypeUpdateToOneWithWhereWithoutTaskActionInputObjectZodSchema = makeSchema();
