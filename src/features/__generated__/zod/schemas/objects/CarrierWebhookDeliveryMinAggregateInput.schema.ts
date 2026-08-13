import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  carrierCode: z.literal(true).optional(),
  environment: z.literal(true).optional(),
  externalEventId: z.literal(true).optional(),
  externalOrderCode: z.literal(true).optional(),
  payloadHash: z.literal(true).optional(),
  signatureValid: z.literal(true).optional(),
  status: z.literal(true).optional(),
  receivedAt: z.literal(true).optional(),
  processedAt: z.literal(true).optional(),
  errorMessage: z.literal(true).optional()
}).strict();
export const CarrierWebhookDeliveryMinAggregateInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryMinAggregateInputType>;
export const CarrierWebhookDeliveryMinAggregateInputObjectZodSchema = makeSchema();
