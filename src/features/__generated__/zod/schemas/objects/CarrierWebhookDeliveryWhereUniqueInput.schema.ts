import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierWebhookDeliveryCarrierCodeEnvironmentExternalEventIdCompoundUniqueInputObjectSchema as CarrierWebhookDeliveryCarrierCodeEnvironmentExternalEventIdCompoundUniqueInputObjectSchema } from './CarrierWebhookDeliveryCarrierCodeEnvironmentExternalEventIdCompoundUniqueInput.schema';
import { CarrierWebhookDeliveryCarrierCodeEnvironmentPayloadHashCompoundUniqueInputObjectSchema as CarrierWebhookDeliveryCarrierCodeEnvironmentPayloadHashCompoundUniqueInputObjectSchema } from './CarrierWebhookDeliveryCarrierCodeEnvironmentPayloadHashCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  carrierCode_environment_externalEventId: z.lazy(() => CarrierWebhookDeliveryCarrierCodeEnvironmentExternalEventIdCompoundUniqueInputObjectSchema).optional(),
  carrierCode_environment_payloadHash: z.lazy(() => CarrierWebhookDeliveryCarrierCodeEnvironmentPayloadHashCompoundUniqueInputObjectSchema).optional()
}).strict();
export const CarrierWebhookDeliveryWhereUniqueInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryWhereUniqueInput>;
export const CarrierWebhookDeliveryWhereUniqueInputObjectZodSchema = makeSchema();
