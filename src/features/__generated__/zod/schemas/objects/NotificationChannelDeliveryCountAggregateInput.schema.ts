import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  dispatchId: z.literal(true).optional(),
  channel: z.literal(true).optional(),
  recipientGroupKey: z.literal(true).optional(),
  status: z.literal(true).optional(),
  errorMessage: z.literal(true).optional(),
  payloadJson: z.literal(true).optional(),
  sentAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const NotificationChannelDeliveryCountAggregateInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryCountAggregateInputType>;
export const NotificationChannelDeliveryCountAggregateInputObjectZodSchema = makeSchema();
