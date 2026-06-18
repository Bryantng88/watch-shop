import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './TaskChecklistItemWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskChecklistItemWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskChecklistItemWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskChecklistItemWhereInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemListRelationFilterObjectSchema: z.ZodType<Prisma.TaskChecklistItemListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemListRelationFilter>;
export const TaskChecklistItemListRelationFilterObjectZodSchema = makeSchema();
