import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './TaskTypeWhereInput.schema';
import { TaskTypeUpdateWithoutTasksInputObjectSchema as TaskTypeUpdateWithoutTasksInputObjectSchema } from './TaskTypeUpdateWithoutTasksInput.schema';
import { TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema as TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema } from './TaskTypeUncheckedUpdateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskTypeWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskTypeUpdateWithoutTasksInputObjectSchema), z.lazy(() => TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema)])
}).strict();
export const TaskTypeUpdateToOneWithWhereWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskTypeUpdateToOneWithWhereWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUpdateToOneWithWhereWithoutTasksInput>;
export const TaskTypeUpdateToOneWithWhereWithoutTasksInputObjectZodSchema = makeSchema();
