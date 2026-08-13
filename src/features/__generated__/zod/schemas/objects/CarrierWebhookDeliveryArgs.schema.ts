import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierWebhookDeliverySelectObjectSchema as CarrierWebhookDeliverySelectObjectSchema } from './CarrierWebhookDeliverySelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CarrierWebhookDeliverySelectObjectSchema).optional()
}).strict();
export const CarrierWebhookDeliveryArgsObjectSchema = makeSchema();
export const CarrierWebhookDeliveryArgsObjectZodSchema = makeSchema();
