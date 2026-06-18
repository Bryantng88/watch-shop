import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema';
import { TaskUpdateWithoutChecklistItemsInputObjectSchema as TaskUpdateWithoutChecklistItemsInputObjectSchema } from './TaskUpdateWithoutChecklistItemsInput.schema';
import { TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema as TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema } from './TaskUncheckedUpdateWithoutChecklistItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskUpdateWithoutChecklistItemsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema)])
}).strict();
export const TaskUpdateToOneWithWhereWithoutChecklistItemsInputObjectSchema: z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutChecklistItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutChecklistItemsInput>;
export const TaskUpdateToOneWithWhereWithoutChecklistItemsInputObjectZodSchema = makeSchema();
