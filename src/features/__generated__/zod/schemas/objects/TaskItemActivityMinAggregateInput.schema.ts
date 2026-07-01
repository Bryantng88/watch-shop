import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  taskItemId: z.literal(true).optional(),
  sourceType: z.literal(true).optional(),
  sourceId: z.literal(true).optional(),
  title: z.literal(true).optional(),
  body: z.literal(true).optional(),
  status: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  occurredAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const TaskItemActivityMinAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemActivityMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityMinAggregateInputType>;
export const TaskItemActivityMinAggregateInputObjectZodSchema = makeSchema();
