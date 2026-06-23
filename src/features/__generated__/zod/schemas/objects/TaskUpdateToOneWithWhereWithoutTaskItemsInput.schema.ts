import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema';
import { TaskUpdateWithoutTaskItemsInputObjectSchema as TaskUpdateWithoutTaskItemsInputObjectSchema } from './TaskUpdateWithoutTaskItemsInput.schema';
import { TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema as TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema } from './TaskUncheckedUpdateWithoutTaskItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskUpdateWithoutTaskItemsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema)])
}).strict();
export const TaskUpdateToOneWithWhereWithoutTaskItemsInputObjectSchema: z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutTaskItemsInput>;
export const TaskUpdateToOneWithWhereWithoutTaskItemsInputObjectZodSchema = makeSchema();
