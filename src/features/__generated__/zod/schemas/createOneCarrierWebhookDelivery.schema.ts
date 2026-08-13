import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliverySelectObjectSchema as CarrierWebhookDeliverySelectObjectSchema } from './objects/CarrierWebhookDeliverySelect.schema';
import { CarrierWebhookDeliveryCreateInputObjectSchema as CarrierWebhookDeliveryCreateInputObjectSchema } from './objects/CarrierWebhookDeliveryCreateInput.schema';
import { CarrierWebhookDeliveryUncheckedCreateInputObjectSchema as CarrierWebhookDeliveryUncheckedCreateInputObjectSchema } from './objects/CarrierWebhookDeliveryUncheckedCreateInput.schema';

export const CarrierWebhookDeliveryCreateOneSchema: z.ZodType<Prisma.CarrierWebhookDeliveryCreateArgs> = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  data: z.union([CarrierWebhookDeliveryCreateInputObjectSchema, CarrierWebhookDeliveryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryCreateArgs>;

export const CarrierWebhookDeliveryCreateOneZodSchema = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  data: z.union([CarrierWebhookDeliveryCreateInputObjectSchema, CarrierWebhookDeliveryUncheckedCreateInputObjectSchema]) }).strict();