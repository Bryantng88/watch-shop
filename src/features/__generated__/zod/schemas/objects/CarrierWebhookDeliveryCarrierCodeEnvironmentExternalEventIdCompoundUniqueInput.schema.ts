import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  carrierCode: z.string(),
  environment: z.string(),
  externalEventId: z.string()
}).strict();
export const CarrierWebhookDeliveryCarrierCodeEnvironmentExternalEventIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryCarrierCodeEnvironmentExternalEventIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryCarrierCodeEnvironmentExternalEventIdCompoundUniqueInput>;
export const CarrierWebhookDeliveryCarrierCodeEnvironmentExternalEventIdCompoundUniqueInputObjectZodSchema = makeSchema();
