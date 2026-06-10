import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeUpdateWithoutTasksInputObjectSchema as TaskTypeUpdateWithoutTasksInputObjectSchema } from './TaskTypeUpdateWithoutTasksInput.schema';
import { TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema as TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema } from './TaskTypeUncheckedUpdateWithoutTasksInput.schema';
import { TaskTypeCreateWithoutTasksInputObjectSchema as TaskTypeCreateWithoutTasksInputObjectSchema } from './TaskTypeCreateWithoutTasksInput.schema';
import { TaskTypeUncheckedCreateWithoutTasksInputObjectSchema as TaskTypeUncheckedCreateWithoutTasksInputObjectSchema } from './TaskTypeUncheckedCreateWithoutTasksInput.schema';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './TaskTypeWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskTypeUpdateWithoutTasksInputObjectSchema), z.lazy(() => TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskTypeCreateWithoutTasksInputObjectSchema), z.lazy(() => TaskTypeUncheckedCreateWithoutTasksInputObjectSchema)]),
  where: z.lazy(() => TaskTypeWhereInputObjectSchema).optional()
}).strict();
export const TaskTypeUpsertWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskTypeUpsertWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUpsertWithoutTasksInput>;
export const TaskTypeUpsertWithoutTasksInputObjectZodSchema = makeSchema();
