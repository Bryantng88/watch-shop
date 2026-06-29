import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  dispatchId: z.boolean().optional(),
  channel: z.boolean().optional(),
  recipientGroupKey: z.boolean().optional(),
  status: z.boolean().optional(),
  errorMessage: z.boolean().optional(),
  payloadJson: z.boolean().optional(),
  sentAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const NotificationChannelDeliverySelectObjectSchema: z.ZodType<Prisma.NotificationChannelDeliverySelect> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliverySelect>;
export const NotificationChannelDeliverySelectObjectZodSchema = makeSchema();
