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
export const TaskItemActivityReplyMaxAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyMaxAggregateInputType>;
export const TaskItemActivityReplyMaxAggregateInputObjectZodSchema = makeSchema();
