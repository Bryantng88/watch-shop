import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskItemWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskItemWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskItemWhereInputObjectSchema).optional()
}).strict();
export const TaskItemListRelationFilterObjectSchema: z.ZodType<Prisma.TaskItemListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemListRelationFilter>;
export const TaskItemListRelationFilterObjectZodSchema = makeSchema();
