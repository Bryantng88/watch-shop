import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  activityId: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  body: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const TaskItemActivityReplyMinAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyMinAggregateInputType>;
export const TaskItemActivityReplyMinAggregateInputObjectZodSchema = makeSchema();
