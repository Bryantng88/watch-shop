import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskUpdateWithoutChecklistItemsInputObjectSchema as TaskUpdateWithoutChecklistItemsInputObjectSchema } from './TaskUpdateWithoutChecklistItemsInput.schema';
import { TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema as TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema } from './TaskUncheckedUpdateWithoutChecklistItemsInput.schema';
import { TaskCreateWithoutChecklistItemsInputObjectSchema as TaskCreateWithoutChecklistItemsInputObjectSchema } from './TaskCreateWithoutChecklistItemsInput.schema';
import { TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema as TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema } from './TaskUncheckedCreateWithoutChecklistItemsInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskUpdateWithoutChecklistItemsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutChecklistItemsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema)]),
  where: z.lazy(() => TaskWhereInputObjectSchema).optional()
}).strict();
export const TaskUpsertWithoutChecklistItemsInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithoutChecklistItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithoutChecklistItemsInput>;
export const TaskUpsertWithoutChecklistItemsInputObjectZodSchema = makeSchema();
