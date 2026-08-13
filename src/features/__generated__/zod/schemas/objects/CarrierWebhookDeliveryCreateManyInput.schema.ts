import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { CarrierWebhookStatusSchema } from '../enums/CarrierWebhookStatus.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  carrierCode: z.string(),
  environment: z.string(),
  externalEventId: z.string().optional().nullable(),
  externalOrderCode: z.string().optional().nullable(),
  payloadHash: z.string(),
  payloadJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  signatureValid: z.boolean().optional(),
  status: CarrierWebhookStatusSchema.optional(),
  receivedAt: z.coerce.date().optional(),
  processedAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable()
}).strict();
export const CarrierWebhookDeliveryCreateManyInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryCreateManyInput>;
export const CarrierWebhookDeliveryCreateManyInputObjectZodSchema = makeSchema();
