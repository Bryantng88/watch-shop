import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  environment: SortOrderSchema.optional(),
  externalEventId: SortOrderSchema.optional(),
  externalOrderCode: SortOrderSchema.optional(),
  payloadHash: SortOrderSchema.optional(),
  signatureValid: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  receivedAt: SortOrderSchema.optional(),
  processedAt: SortOrderSchema.optional(),
  errorMessage: SortOrderSchema.optional()
}).strict();
export const CarrierWebhookDeliveryMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryMinOrderByAggregateInput>;
export const CarrierWebhookDeliveryMinOrderByAggregateInputObjectZodSchema = makeSchema();
