import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { NotificationChannelDeliveryCountOrderByAggregateInputObjectSchema as NotificationChannelDeliveryCountOrderByAggregateInputObjectSchema } from './NotificationChannelDeliveryCountOrderByAggregateInput.schema';
import { NotificationChannelDeliveryMaxOrderByAggregateInputObjectSchema as NotificationChannelDeliveryMaxOrderByAggregateInputObjectSchema } from './NotificationChannelDeliveryMaxOrderByAggregateInput.schema';
import { NotificationChannelDeliveryMinOrderByAggregateInputObjectSchema as NotificationChannelDeliveryMinOrderByAggregateInputObjectSchema } from './NotificationChannelDeliveryMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  dispatchId: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  recipientGroupKey: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sentAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => NotificationChannelDeliveryCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => NotificationChannelDeliveryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => NotificationChannelDeliveryMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const NotificationChannelDeliveryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryOrderByWithAggregationInput>;
export const NotificationChannelDeliveryOrderByWithAggregationInputObjectZodSchema = makeSchema();
