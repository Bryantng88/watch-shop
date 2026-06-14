import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './TaskActionWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskActionWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskActionWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskActionWhereInputObjectSchema).optional()
}).strict();
export const TaskActionListRelationFilterObjectSchema: z.ZodType<Prisma.TaskActionListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionListRelationFilter>;
export const TaskActionListRelationFilterObjectZodSchema = makeSchema();
