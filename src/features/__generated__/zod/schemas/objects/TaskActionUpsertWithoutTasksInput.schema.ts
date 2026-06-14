import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionUpdateWithoutTasksInputObjectSchema as TaskActionUpdateWithoutTasksInputObjectSchema } from './TaskActionUpdateWithoutTasksInput.schema';
import { TaskActionUncheckedUpdateWithoutTasksInputObjectSchema as TaskActionUncheckedUpdateWithoutTasksInputObjectSchema } from './TaskActionUncheckedUpdateWithoutTasksInput.schema';
import { TaskActionCreateWithoutTasksInputObjectSchema as TaskActionCreateWithoutTasksInputObjectSchema } from './TaskActionCreateWithoutTasksInput.schema';
import { TaskActionUncheckedCreateWithoutTasksInputObjectSchema as TaskActionUncheckedCreateWithoutTasksInputObjectSchema } from './TaskActionUncheckedCreateWithoutTasksInput.schema';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './TaskActionWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskActionUpdateWithoutTasksInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutTasksInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskActionCreateWithoutTasksInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTasksInputObjectSchema)]),
  where: z.lazy(() => TaskActionWhereInputObjectSchema).optional()
}).strict();
export const TaskActionUpsertWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskActionUpsertWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpsertWithoutTasksInput>;
export const TaskActionUpsertWithoutTasksInputObjectZodSchema = makeSchema();
