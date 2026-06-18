import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema as TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema } from './TaskCreateNestedOneWithoutChecklistItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  task: z.lazy(() => TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema)
}).strict();
export const TaskChecklistItemCreateWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateWithoutExecutionsInput>;
export const TaskChecklistItemCreateWithoutExecutionsInputObjectZodSchema = makeSchema();
