import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  carrierCode: z.string(),
  environment: z.string(),
  payloadHash: z.string()
}).strict();
export const CarrierWebhookDeliveryCarrierCodeEnvironmentPayloadHashCompoundUniqueInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryCarrierCodeEnvironmentPayloadHashCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryCarrierCodeEnvironmentPayloadHashCompoundUniqueInput>;
export const CarrierWebhookDeliveryCarrierCodeEnvironmentPayloadHashCompoundUniqueInputObjectZodSchema = makeSchema();
