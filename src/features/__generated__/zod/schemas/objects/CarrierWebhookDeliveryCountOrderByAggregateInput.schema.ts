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
  payloadJson: SortOrderSchema.optional(),
  signatureValid: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  receivedAt: SortOrderSchema.optional(),
  processedAt: SortOrderSchema.optional(),
  errorMessage: SortOrderSchema.optional()
}).strict();
export const CarrierWebhookDeliveryCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryCountOrderByAggregateInput>;
export const CarrierWebhookDeliveryCountOrderByAggregateInputObjectZodSchema = makeSchema();
