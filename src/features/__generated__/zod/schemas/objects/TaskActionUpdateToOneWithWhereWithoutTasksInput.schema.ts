import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './TaskActionWhereInput.schema';
import { TaskActionUpdateWithoutTasksInputObjectSchema as TaskActionUpdateWithoutTasksInputObjectSchema } from './TaskActionUpdateWithoutTasksInput.schema';
import { TaskActionUncheckedUpdateWithoutTasksInputObjectSchema as TaskActionUncheckedUpdateWithoutTasksInputObjectSchema } from './TaskActionUncheckedUpdateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskActionUpdateWithoutTasksInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutTasksInputObjectSchema)])
}).strict();
export const TaskActionUpdateToOneWithWhereWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateToOneWithWhereWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateToOneWithWhereWithoutTasksInput>;
export const TaskActionUpdateToOneWithWhereWithoutTasksInputObjectZodSchema = makeSchema();
