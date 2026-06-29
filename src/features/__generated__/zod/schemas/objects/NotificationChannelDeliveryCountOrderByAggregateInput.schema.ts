import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  dispatchId: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  recipientGroupKey: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  errorMessage: SortOrderSchema.optional(),
  payloadJson: SortOrderSchema.optional(),
  sentAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationChannelDeliveryCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryCountOrderByAggregateInput>;
export const NotificationChannelDeliveryCountOrderByAggregateInputObjectZodSchema = makeSchema();
