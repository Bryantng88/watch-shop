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
  sentAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationChannelDeliveryMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryMinOrderByAggregateInput>;
export const NotificationChannelDeliveryMinOrderByAggregateInputObjectZodSchema = makeSchema();
