import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  activityId: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  body: z.literal(true).optional(),
  metadataJson: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const TaskItemActivityReplyCountAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCountAggregateInputType>;
export const TaskItemActivityReplyCountAggregateInputObjectZodSchema = makeSchema();
