import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  businessEventLogId: z.literal(true).optional(),
  ruleId: z.literal(true).optional(),
  eventKey: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  errorMessage: z.literal(true).optional(),
  payloadJson: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const NotificationDispatchCountAggregateInputObjectSchema: z.ZodType<Prisma.NotificationDispatchCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.NotificationDispatchCountAggregateInputType>;
export const NotificationDispatchCountAggregateInputObjectZodSchema = makeSchema();
