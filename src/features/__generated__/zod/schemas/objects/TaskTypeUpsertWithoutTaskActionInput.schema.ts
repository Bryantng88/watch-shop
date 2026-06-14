import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeUpdateWithoutTaskActionInputObjectSchema as TaskTypeUpdateWithoutTaskActionInputObjectSchema } from './TaskTypeUpdateWithoutTaskActionInput.schema';
import { TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema as TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema } from './TaskTypeUncheckedUpdateWithoutTaskActionInput.schema';
import { TaskTypeCreateWithoutTaskActionInputObjectSchema as TaskTypeCreateWithoutTaskActionInputObjectSchema } from './TaskTypeCreateWithoutTaskActionInput.schema';
import { TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema as TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema } from './TaskTypeUncheckedCreateWithoutTaskActionInput.schema';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './TaskTypeWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskTypeUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskTypeCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema)]),
  where: z.lazy(() => TaskTypeWhereInputObjectSchema).optional()
}).strict();
export const TaskTypeUpsertWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskTypeUpsertWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUpsertWithoutTaskActionInput>;
export const TaskTypeUpsertWithoutTaskActionInputObjectZodSchema = makeSchema();
