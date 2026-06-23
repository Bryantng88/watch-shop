import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistWhereInputObjectSchema as TaskItemChecklistWhereInputObjectSchema } from './TaskItemChecklistWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskItemChecklistWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskItemChecklistWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskItemChecklistWhereInputObjectSchema).optional()
}).strict();
export const TaskItemChecklistListRelationFilterObjectSchema: z.ZodType<Prisma.TaskItemChecklistListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistListRelationFilter>;
export const TaskItemChecklistListRelationFilterObjectZodSchema = makeSchema();
