import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  taskItemId: z.string(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  doneAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  taskId: z.string().optional().nullable()
}).strict();
export const TaskItemChecklistUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUncheckedCreateInput>;
export const TaskItemChecklistUncheckedCreateInputObjectZodSchema = makeSchema();
