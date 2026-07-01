import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyWhereInputObjectSchema as TaskItemActivityReplyWhereInputObjectSchema } from './TaskItemActivityReplyWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskItemActivityReplyWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskItemActivityReplyWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskItemActivityReplyWhereInputObjectSchema).optional()
}).strict();
export const TaskItemActivityReplyListRelationFilterObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyListRelationFilter>;
export const TaskItemActivityReplyListRelationFilterObjectZodSchema = makeSchema();
