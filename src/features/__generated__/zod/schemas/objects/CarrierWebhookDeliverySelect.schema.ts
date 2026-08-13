import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  carrierCode: z.boolean().optional(),
  environment: z.boolean().optional(),
  externalEventId: z.boolean().optional(),
  externalOrderCode: z.boolean().optional(),
  payloadHash: z.boolean().optional(),
  payloadJson: z.boolean().optional(),
  signatureValid: z.boolean().optional(),
  status: z.boolean().optional(),
  receivedAt: z.boolean().optional(),
  processedAt: z.boolean().optional(),
  errorMessage: z.boolean().optional()
}).strict();
export const CarrierWebhookDeliverySelectObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliverySelect> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliverySelect>;
export const CarrierWebhookDeliverySelectObjectZodSchema = makeSchema();
