import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  refNo: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  scope: z.literal(true).optional(),
  status: z.literal(true).optional(),
  priority: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  categoryId: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  shipmentId: z.literal(true).optional(),
  raisedByUserId: z.literal(true).optional(),
  assignedToUserId: z.literal(true).optional(),
  triagedAt: z.literal(true).optional(),
  resolvedAt: z.literal(true).optional(),
  cancelledAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const WorkCaseCountAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCountAggregateInputType>;
export const WorkCaseCountAggregateInputObjectZodSchema = makeSchema();
