import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  taskId: z.string(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const TaskChecklistItemCreateManyInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateManyInput>;
export const TaskChecklistItemCreateManyInputObjectZodSchema = makeSchema();
