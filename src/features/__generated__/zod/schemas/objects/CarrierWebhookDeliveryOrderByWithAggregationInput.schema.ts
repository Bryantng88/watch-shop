import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CarrierWebhookDeliveryCountOrderByAggregateInputObjectSchema as CarrierWebhookDeliveryCountOrderByAggregateInputObjectSchema } from './CarrierWebhookDeliveryCountOrderByAggregateInput.schema';
import { CarrierWebhookDeliveryMaxOrderByAggregateInputObjectSchema as CarrierWebhookDeliveryMaxOrderByAggregateInputObjectSchema } from './CarrierWebhookDeliveryMaxOrderByAggregateInput.schema';
import { CarrierWebhookDeliveryMinOrderByAggregateInputObjectSchema as CarrierWebhookDeliveryMinOrderByAggregateInputObjectSchema } from './CarrierWebhookDeliveryMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  environment: SortOrderSchema.optional(),
  externalEventId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  externalOrderCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  payloadHash: SortOrderSchema.optional(),
  payloadJson: SortOrderSchema.optional(),
  signatureValid: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  receivedAt: SortOrderSchema.optional(),
  processedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => CarrierWebhookDeliveryCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CarrierWebhookDeliveryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CarrierWebhookDeliveryMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CarrierWebhookDeliveryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryOrderByWithAggregationInput>;
export const CarrierWebhookDeliveryOrderByWithAggregationInputObjectZodSchema = makeSchema();
