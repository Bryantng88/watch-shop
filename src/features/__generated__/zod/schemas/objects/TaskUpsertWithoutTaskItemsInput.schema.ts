import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskUpdateWithoutTaskItemsInputObjectSchema as TaskUpdateWithoutTaskItemsInputObjectSchema } from './TaskUpdateWithoutTaskItemsInput.schema';
import { TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema as TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema } from './TaskUncheckedUpdateWithoutTaskItemsInput.schema';
import { TaskCreateWithoutTaskItemsInputObjectSchema as TaskCreateWithoutTaskItemsInputObjectSchema } from './TaskCreateWithoutTaskItemsInput.schema';
import { TaskUncheckedCreateWithoutTaskItemsInputObjectSchema as TaskUncheckedCreateWithoutTaskItemsInputObjectSchema } from './TaskUncheckedCreateWithoutTaskItemsInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskUpdateWithoutTaskItemsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutTaskItemsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskItemsInputObjectSchema)]),
  where: z.lazy(() => TaskWhereInputObjectSchema).optional()
}).strict();
export const TaskUpsertWithoutTaskItemsInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithoutTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithoutTaskItemsInput>;
export const TaskUpsertWithoutTaskItemsInputObjectZodSchema = makeSchema();
